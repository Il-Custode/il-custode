param(
    [string]$msg = "Aggiornamento"
)

git add .
git commit -m "$msg"
git push origin main
git push beta main
npm run build -- --publish always