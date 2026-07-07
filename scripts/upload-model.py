"""
upload-model.py — uploads model/dex-deal-score.onnx to HuggingFace
and prints the exact onnxModelId string to paste into your contract calls.

Usage:
    python scripts/upload-model.py --token hf_xxxYourTokenxxx --repo your-username/dex-deal-score

Get a write token at: https://huggingface.co/settings/tokens
Create a public repo at: https://huggingface.co/new (name it "dex-deal-score")
"""

import argparse
import sys
from pathlib import Path

try:
    from huggingface_hub import HfApi, create_repo
except ImportError:
    print("Error: huggingface_hub not installed.")
    print("Run: pip install huggingface_hub")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Upload dex-deal-score.onnx to HuggingFace")
    parser.add_argument("--token", required=True, help="HuggingFace write token (hf_xxx...)")
    parser.add_argument("--repo",  required=True, help="HuggingFace repo id, e.g. yourname/dex-deal-score")
    args = parser.parse_args()

    onnx_path = Path(__file__).parent.parent / "model" / "dex-deal-score.onnx"
    if not onnx_path.exists():
        print(f"Error: {onnx_path} not found. Run: python scripts/build_model.py")
        sys.exit(1)

    print(f"\nUploading {onnx_path} ({onnx_path.stat().st_size} bytes)")
    print(f"  -> repo: {args.repo}")
    print(f"  -> file: dex-deal-score.onnx\n")

    api = HfApi(token=args.token)

    # Create repo if it doesn't exist (public, model type)
    try:
        create_repo(args.repo, token=args.token, repo_type="model", exist_ok=True, private=False)
        print("Repo ready.")
    except Exception as e:
        print(f"Warning creating repo (may already exist): {e}")

    # Upload the file
    commit_info = api.upload_file(
        path_or_fileobj=str(onnx_path),
        path_in_repo="dex-deal-score.onnx",
        repo_id=args.repo,
        repo_type="model",
        commit_message="Upload dex-deal-score.onnx (INT32 4-feature rule-based ONNX model)",
    )

    sha = commit_info.oid if hasattr(commit_info, 'oid') else None

    # Fallback: fetch sha from API if not returned directly
    if not sha:
        info = api.model_info(args.repo)
        sha = info.sha

    print(f"\n{'='*60}")
    print(f"  Upload complete!")
    print(f"  Commit SHA: {sha}")
    print(f"")
    print(f"  Use this onnxModelId in check-token.mjs and index.html:")
    print(f"")
    print(f"  hf/{args.repo}/dex-deal-score.onnx@{sha}")
    print(f"{'='*60}\n")

    # Auto-patch check-token.mjs with the real model ID
    check_token_path = Path(__file__).parent / "check-token.mjs"
    if check_token_path.exists():
        content = check_token_path.read_text(encoding="utf-8")
        old_line = None
        for line in content.splitlines():
            if "hf/Ritual-Net/sample_linreg" in line or "hf/" in line and "linreg" in line:
                old_line = line
                break
        if old_line:
            new_model_id = f"hf/{args.repo}/dex-deal-score.onnx@{sha}"
            new_content = content.replace(
                old_line.strip().strip("'"),
                new_model_id
            )
            # More robust: find and replace the full default value
            import re
            new_content = re.sub(
                r"hf/[^'\"]+\.onnx@[a-f0-9]+",
                f"hf/{args.repo}/dex-deal-score.onnx@{sha}",
                content,
            )
            check_token_path.write_text(new_content, encoding="utf-8")
            print(f"  Auto-patched scripts/check-token.mjs with new model ID.")

    print("  Next: node scripts/check-token.mjs --network ethereum --token 0xC02a...")
    print("  (First call may take 1-5 blocks — executor downloads/caches the model)")

if __name__ == "__main__":
    main()
