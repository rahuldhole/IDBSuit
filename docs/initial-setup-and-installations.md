## Setup & Installations

References:
Github repo: https://github.com/mattpocock/pkg-demo/
Youtube: https://www.youtube.com/watch?v=eh89VE3Mk5g

1. `npm install -g pnpm`
    Update all pkgs to latest versions and run `pnpm install`
2. `pnpm changeset init` to document changes
    run `pnpm changeset` before each version change PR.
    In github publish workflow it will auto create a PR for version update.
3. Create `tsconfig.json` by `pnpm tsc --init`
4. `pnpm add -D tsup` to bundle .ts files into .js
    Add build script in package.json as `tsup index.ts --format cjs,esm --dts`
    for `pnpm run build`
5. "lint": "tsc" add in package.json
    `pnpm run lint`
6. Install `Typedoc` and `typedoc-material-theme`
7. Publish latest docs on github pages with domain docs.idbsuit.org
8. Cloudflare or Netlify setup to publish docs from each release branch
