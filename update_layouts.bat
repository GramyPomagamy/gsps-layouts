@echo off
echo "Aktualizowanie plików layoutów..."
git pull
echo "Budowanie zaktualizowanych layoutów..."
npm run build