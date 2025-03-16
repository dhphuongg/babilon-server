BRANCH=main

echo "Update source"

git fetch origin $BRANCH
git checkout $BRANCH
git reset --hard origin/HEAD
git pull

docker compose down server
docker compose up -d --build server
