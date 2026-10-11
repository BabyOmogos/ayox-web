<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Keep service content in the home route and use shared semantic CSS and Button controls, so redesigns preserve the complete service catalogue.
- Store downloaded media as Lovable asset pointers; never depend on the previous site's image hosting.
- Show a dated, attributed selection of publicly retrieved Google reviews without a public Places proxy, to avoid exposing billable unauthenticated API access.
- Load the Google Maps place embed only after visitor consent, using the managed browser key and the exact place ID.
