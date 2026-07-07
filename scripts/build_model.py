"""
build_model.py -- builds dex-deal-score.onnx

Architecture: EXACTLY mirrors the Ritual-Net/sample_linreg test model:
  - Single op: Gemm (Y = alpha * A @ B + beta * C)
  - Opset 17
  - Input:  FLOAT32 [1, 4]
  - Output: FLOAT32 [1, 1]

Output is a float "deal score". Thresholding is done in Solidity:
  score < 0.5  -> RISKY (0)
  0.5 <= score < 1.5 -> FAIR (1)
  score >= 1.5 -> UNDERVALUED (2)

Features (from JQ queries, all floats passed as IEEE 754 bit-patterns):
    f[0] = liquidity_usd / 1000   (e.g. $520M -> 520000.0)
    f[1] = volume_usd_24h / 1000  (e.g. $177M -> 177000.0)
    f[2] = price_change_24h * 100 (e.g. +0.35% -> 35.0, crash -> -3000.0)
    f[3] = buys_24h + sells_24h   (e.g. 151780.0)

Run with: python scripts/build_model.py  (from repo root OR from model/ dir)
Produces: dex-deal-score.onnx  (in current directory, typically model/)
"""

import numpy as np
import onnx
from onnx import helper, TensorProto, numpy_helper
import onnxruntime as ort


# ---------- Decision thresholds (for reference -- used in Solidity too) ------
# score < 0.5  -> 0 = RISKY
# 0.5 <= s < 1.5 -> 1 = FAIR
# score >= 1.5 -> 2 = UNDERVALUED

def design_weights():
    """
    Hand-design a weight vector and bias so that the linear score
    output = f @ W.T + b  produces:
      ~0.0 for RISKY  (thin market OR crashed price)
      ~1.0 for FAIR   (healthy depth, flat/positive price)
      ~2.0 for UNDERVALUED (healthy depth, dipped price)

    Gemm computes: Y = alpha * (input @ W.T) + beta * bias
    with alpha=1, beta=1, transB=1, so W is [1, 4] (one row per output).

    Weight design (all divided by 1e5 for numerical stability):
      w[liq] = 1.0   -> more liq -> higher score
      w[vol] = 1.0   -> more vol -> higher score
      w[price] = X   -> need crash to give ~0, dip to give ~2, flat to give ~1

    Let score = (liq*1 + vol*1 + price*P) * 1e-5 + bias

    For WETH (liq=520k, vol=177k, price=35):    want score ~1.0
    For Thin (liq=10, vol=5, price=20):          want score ~0.0
    For Crash (liq=500k, vol=200k, price=-3000): want score ~0.0
    For Dip   (liq=500k, vol=200k, price=-500):  want score ~2.0

    From WETH: (520000+177000+35*P)*1e-5 + b ~ 1.0
               (697000+35P)*1e-5 + b ~ 1.0  ... (1)

    From Thin: (10+5+20*P)*1e-5 + b ~ 0.0
               (15+20P)*1e-5 + b ~ 0.0      ... (2)

    (1)-(2): (697000-15 + 35P-20P)*1e-5 ~ 1.0
             (696985 + 15P) * 1e-5 ~ 1.0
             15P ~ 100000 - 696985 = -596985
             P ~ -39799 ... way too large. Need different feature scaling.

    Alternative: normalize features before the linear layer.
    Since we can use Gemm with transB, the effective weight matrix is [1, 4].
    Let's just pick weights that work with the actual feature magnitudes:

    Observed feature ranges:
      liq_feature (liq/1000):  0..600000  (median healthy ~300000)
      vol_feature (vol/1000):  0..200000  (median healthy ~100000)
      price_feature (price*100): -5000..+500
      tx_feature:  0..300000

    We want: healthy_depth = liq + vol (~400000 for healthy, ~15 for thin)
             score = f(healthy_depth, price)

    Simplest: two-variable model
      score = (liq + vol) * w_depth + price * w_price + bias

    WETH: (697000)*w_d + 35*w_p + b = 1.0
    Thin: (15)*w_d + 20*w_p + b = 0.0
    Crash (liq=500k, vol=200k, price=-3000): 700000*w_d + (-3000)*w_p + b = 0.0
    Dip  (liq=500k, vol=200k, price=-500):  700000*w_d + (-500)*w_p + b = 2.0

    Crash - Dip: (-3000-(-500))*w_p = 0.0 - 2.0
                 (-2500)*w_p = -2.0
                 w_p = 0.0008

    From Crash: 700000*w_d + (-3000)*0.0008 + b = 0.0
                700000*w_d - 2.4 + b = 0.0   ... (A)

    From Dip: 700000*w_d + (-500)*0.0008 + b = 2.0
              700000*w_d - 0.4 + b = 2.0     ... (B)

    (B)-(A): -0.4+b - (-2.4+b) = 2.0-0.0 => 2.0 = 2.0 ✓ (consistent)
    From (A): 700000*w_d + b = 2.4  ... (C)

    From Thin: 15*w_d + 20*0.0008 + b = 0.0
               15*w_d + 0.016 + b = 0.0
               15*w_d + b = -0.016  ... (D)

    (C)-(D): (700000-15)*w_d = 2.4 - (-0.016) = 2.416
             699985*w_d = 2.416
             w_d = 2.416/699985 = 3.452e-6

    From (D): 15*3.452e-6 + b = -0.016
              0.0000518 + b = -0.016
              b = -0.0160518

    Check WETH: 697000*3.452e-6 + 35*0.0008 + (-0.0160518)
              = 2.406 + 0.028 - 0.016 = 2.418  <- too high (should be ~1)

    The WETH depth (697000) is similar to healthy crash/dip (700000), so they cluster.
    The only discriminator between WETH (score=1) and Dip (score=2) must be price.
    But WETH price=35 and Dip price=-500. With w_p=0.0008: 35*0.0008=0.028, (-500)*0.0008=-0.4
    Difference = 0.428. That's less than 1 unit.

    We need a bigger price weight. Let w_p = 0.002 and rescale:

    Crash - Dip: (-2500)*w_p = -2.0 => w_p = 0.0008  (locked by constraints)

    Actually the constraint fixes w_p = 0.0008 if we want exactly 2.0 difference.
    Let's relax: just need Crash < 0.5 and Dip > 1.5:

    Dip - Crash > 1.0 (need at least 1 unit gap for threshold to work):
    (-500 - (-3000))*w_p > 1.0
    2500*w_p > 1.0
    w_p > 0.0004

    Let's try w_p = 0.001:

    From Dip + Crash symmetry around 1.0:
    700000*w_d + (-500)*0.001 + b = 1.7  (target >1.5)
    700000*w_d + (-3000)*0.001 + b = 0.2 (target <0.5)

    From Dip: 700000*w_d - 0.5 + b = 1.7  => 700000*w_d + b = 2.2 ... (C)
    From Thin: 15*w_d + 20*0.001 + b = 0 => 15*w_d + b = -0.02 ... (D)
    (C)-(D): 699985*w_d = 2.22 => w_d = 3.172e-6
    From (D): b = -0.02 - 15*3.172e-6 = -0.02 - 0.0000476 = -0.0200476

    WETH: 697000*3.172e-6 + 35*0.001 - 0.020 = 2.211 + 0.035 - 0.020 = 2.226  Still too high

    The WETH depth (697k) ≈ Dip depth (700k), so they'll score similarly on the depth term.
    WETH price=+35 gives slight positive vs Dip price=-500 gives negative.
    With w_p=0.001: WETH vs Dip price diff = (35-(-500))*0.001 = 0.535

    So WETH score = Dip score + 0.535. If Dip=1.7, WETH=2.235 (too high).
    If Dip=1.0, WETH=1.535 (WETH would be UNDERVALUED too).

    This approach can't separate FAIR from UNDERVALUED for similar-depth tokens
    using just a single linear model with positive-price → FAIR distinction.

    CONCLUSION: Use a 2-output linear model instead:
      output[0] = crash_score (high for crash/thin)
      output[1] = dip_score (high for dip, low for crash)
    Then in Solidity:
      if crash_score > threshold: RISKY
      elif dip_score > threshold: UNDERVALUED
      else: FAIR

    But the ONNX skill says the LINREG model has shape [1,1] output...
    Actually looking at the diagnose result:
      dtype=5 shape=[1,1] float=2.4 verdict=2 (UNDERVALUED)

    The test model outputs a float, and we do thresholding in Solidity.
    Let's use a [1,2] output instead: [crash_indicator, dip_indicator]
    Then in Solidity:
      if output[0] > 0.5: RISKY
      elif output[1] > 0.5: UNDERVALUED
      else: FAIR

    W is [2, 4] (2 outputs, 4 inputs):
      crash: high for (low depth OR big negative price)
      dip: high for (high depth AND moderate negative price)

    Actually let me just use a simple approach with a [1,1] output score
    that maps: thin=0, crash=0.25, weth=1.0, dip=2.0
    and thresholds at 0.5 and 1.5 in Solidity.

    Given the math above shows we can't easily separate WETH from DIP with
    depth + price alone... let me accept that WETH might also score as UNDERVALUED
    since WETH with slight positive price is often considered a fair deal anyway.
    The real classification is: RISKY (<0.5) vs NOT_RISKY (>=0.5).
    We split NOT_RISKY into FAIR vs UNDERVALUED based on price sign.

    Final simple weights:
      w = [w_liq, w_vol, w_price, 0.0]
      score = f @ w.T + bias  (FLOAT32 [1,1] output)

    Let's use:
      w_liq = 4.0e-6     (697000*4e-6 = 2.788, 15*4e-6 = 0.00006)
      w_vol = 0.0        (already captured by liq signal)
      w_price = 5.0e-4   (35*5e-4=0.0175, -3000*5e-4=-1.5, -500*5e-4=-0.25)
      bias = 0.0

    WETH: 520000*4e-6 + 0 + 35*5e-4 + 0 = 2.08 + 0.0175 = 2.0975 (~FAIR if we clamp)
    Thin: 10*4e-6 + 0 + 20*5e-4 + 0 = 0.00004 + 0.01 = 0.01004 (RISKY ✓)
    Crash: 500000*4e-6 + 0 + (-3000)*5e-4 = 2.0 - 1.5 = 0.5 (borderline FAIR)
    Dip: 500000*4e-6 + 0 + (-500)*5e-4 = 2.0 - 0.25 = 1.75 (UNDERVALUED)

    Crash is 0.5, need it to be < 0.5. Let me increase w_price:
      w_price = 7e-4: Crash: 2.0 - 2.1 = -0.1 (RISKY ✓), Dip: 2.0-0.35=1.65 (UNDERVAL ✓)
      WETH: 2.0975 with vol dropped: 520000*4e-6+35*7e-4 = 2.08+0.0245 = 2.1045

    But WETH at 2.1 is in UNDERVALUED range (>1.5). Is that OK? Yes! WETH IS undervalued
    compared to its peers -- it's just Wrapped Ether, and if price is slightly positive,
    it's a good deal. The contract's labels are about trading opportunity, not absolute value.

    But the user description says FAIR=1. Let me reconsider threshold:
    Maybe just use thresholds 0 and 0.5 for RISKY vs FAIR, ignore UNDERVALUED for now.
    OR: accept that WETH + positive price = UNDERVALUED (good deal), which is fine semantics.

    Let me just use the simpler [1,1] model with these weights and accept the semantics.
    """
    # w [1, 4] (one row, 4 inputs) for Gemm transB=1
    # score = input @ w.T + b
    #
    # Calibrated for LOG-SCALE JQ features (0..80 for liq/vol, -1000..+1000 for price):
    #   f[0] = log10(liquidity_usd) step bucket x10  (0..80)
    #   f[1] = log10(volume_usd)    step bucket x10  (0..80)
    #   f[2] = price_change capped ±100% scaled x10  (-1000..+1000)
    #   f[3] = 0 (unused)
    #
    # Verified test cases (see implementation_plan.md):
    #   Dead/rug   [0, 0, 0, 0]     -> 0.00  RISKY  ✓
    #   Wojak      [40, 40, 19, 0]  -> 0.62  FAIR   ✓  (was RISKY with old model)
    #   WETH       [70, 70, 3, 0]   -> 0.99  FAIR   ✓
    #   Solana pump[50, 60, 254, 0] -> 1.51  MOMENT ✓
    #   Rug/crash  [50, 0, -990, 0] -> -2.52 RISKY  ✓
    w = np.array([[0.009, 0.005, 0.003, 0.0]], dtype=np.float32)
    b = np.array([[0.0]], dtype=np.float32)
    return w, b


def build_model():
    """
    Exact clone of Ritual-Net/sample_linreg structure:
    - Single Gemm node
    - Opset 17
    - FLOAT32 input [1, 4]
    - FLOAT32 output [1, 1]
    - Weights embedded as graph initializers (not Constants)
    """
    w, b = design_weights()

    features = helper.make_tensor_value_info("features", TensorProto.FLOAT, [1, 4])
    verdict = helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, 1])

    # Initializers (embedded weights, same pattern as the linreg model)
    w_init = numpy_helper.from_array(w, name="linear.weight")
    b_init = numpy_helper.from_array(b, name="linear.bias")

    # Gemm: Y = alpha * A @ B^T + beta * C
    # alpha=1, beta=1, transB=1 (weight is [out, in])
    gemm = helper.make_node(
        "Gemm",
        inputs=["features", "linear.weight", "linear.bias"],
        outputs=["output"],
        alpha=1.0,
        beta=1.0,
        transB=1
    )

    graph = helper.make_graph(
        [gemm], "dex-deal-score",
        [features], [verdict],
        initializer=[w_init, b_init]
    )
    model = helper.make_model(graph, producer_name="dex-deal-checker")
    model.opset_import[0].version = 17  # match the Ritual test model exactly
    onnx.checker.check_model(model)
    return model


def test_model(model):
    """Verify with onnxruntime before uploading."""
    sess = ort.InferenceSession(model.SerializeToString())

    # Thresholds applied in Solidity: score<0.5->RISKY, 0.5-1.5->FAIR, >=1.5->MOMENTUM
    def classify(score):
        if score < 0.5:  return "RISKY"
        if score < 1.5:  return "FAIR"
        return "MOMENTUM"

    # Capped-linear features: f[0]=min(liq,$1M)/10000 (0..100), f[1]=min(vol,$1M)/10000 (0..100),
    # f[2]=clamp(price,±100)*10 (-1000..+1000), f[3]=0
    test_cases = [
        # name,                                       [liq_0..100, vol_0..100, price_sig, 0], expected
        ("Dead/rug ($0)",                              [  0.0,   0.0,    0.0, 0.0], "RISKY"),
        ("Micro rug ($500, -90%)",                     [  0.0,   0.0, -900.0, 0.0], "RISKY"),
        ("Thin ($5k liq, $1k vol, 0%)",               [  0.0,   0.0,    0.0, 0.0], "RISKY"),
        ("Small ($50k liq, $20k vol, -5%)",           [  5.0,   2.0,  -50.0, 0.0], "RISKY"),
        ("Wojak ($725k liq, $466k vol, +1.9%)",       [ 72.0,  46.0,   19.0, 0.0], "FAIR"),
        ("Normal ($5M liq, $500k vol, 0%)",           [100.0,  50.0,    0.0, 0.0], "FAIR"),
        ("WETH ($500M liq, $200M vol, +0.3%)",        [100.0, 100.0,    3.0, 0.0], "FAIR"),
        ("BNB ($3B liq, $1B vol, +1%)",               [100.0, 100.0,   10.0, 0.0], "FAIR"),
        ("Solana pump ($2.85M,$39.85M,+25.43%)",      [100.0, 100.0,  254.0, 0.0], "MOMENTUM"),
        ("Big pump (+50%)",                            [100.0, 100.0,  500.0, 0.0], "MOMENTUM"),
        ("Rug crash ($1M liq, $0 vol, -99%)",         [100.0,   0.0, -990.0, 0.0], "RISKY"),
    ]

    print("\n--- test run ---")
    all_ok = True
    for name, feats, expected in test_cases:
        arr = np.array([feats], dtype=np.float32)
        score = float(sess.run(["output"], {"features": arr})[0][0][0])
        label = classify(score)
        ok = label == expected
        all_ok = all_ok and ok
        marker = "OK" if ok else "WRONG (expected " + expected + ")"
        print(f"  [{marker}] {name}: score={score:.4f} -> {label}")
    print("All OK ✓" if all_ok else "SOME WRONG -- fix weights in design_weights()")


if __name__ == "__main__":
    from pathlib import Path
    model = build_model()
    out_path = Path(__file__).parent.parent / "model" / "dex-deal-score.onnx"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    onnx.save(model, str(out_path))
    print(f"Saved {out_path}")
    test_model(model)
