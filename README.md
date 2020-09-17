# happy-little-action
Happy little accidents appear in your github repository

## Inputs

### `github-token`

**Required** Your Github Token used to auth to github rest api, set to: `"${{ secrets.GITHUB_TOKEN }}"`.

## Example usage

```
uses: rdlucas2/happy-little-action@v0.0.1
    with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```