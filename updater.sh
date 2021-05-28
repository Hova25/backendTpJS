cd backendTpJS
git fetch
git reset --hard origin/master
pm2 restart ./main.js
cd ..
cd tp01front
git fetch
git reset --hard origin/master
sed -i 's/localhost/ec2-3-93-115-149.compute-1.amazonaws.com/' ./app/services/baseApi.js
sudo service nginx restart
echo "Mise à jour des projets réalisé !"
exit
