
I ran:

terraform init (first time only)
terraform plan
terraform apply
terraform destroy # Removes everything

To deploy Backend:
- Remember to take public IP from EC2 and add to GH secret as HOST
- I don't think you have to set up keys again. Yours is valvio-key.pem 

- To get the db url run: terraform output rds_endpoint
- To get the db password run: terraform output -raw db_password


Steps to get the first manual deployment to EC2:

cd backend
./mvnw clean package -DskipTests

# From your project root directory (adjust IP as needed)
cd ../
scp -i ~/.ssh/valvio-key.pem \
  backend/target/valvio-0.0.1-SNAPSHOT.jar \
  ec2-user@54.152.223.25:/home/ec2-user/

## In EC2 SSH terminal:
# Move the JAR to /app
sudo systemctl stop spring-app
sudo mv /home/ec2-user/valvio-0.0.1-SNAPSHOT.jar /app/
sudo chown ec2-user:ec2-user /app/valvio-0.0.1-SNAPSHOT.jar

sudo systemctl daemon-reload
sudo systemctl enable spring-app
sudo systemctl start spring-app
sudo systemctl status spring-app

# View logs
sudo journalctl -u spring-app -f


# You also installed Cloudflare tunnel to get around https issue
# This will change on every restart though!
API url will look like this: https://marina-williams-scotland-small.trycloudflare.com

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable cloudflare-tunnel
sudo systemctl start cloudflare-tunnel

# Get the most recent url:
sudo journalctl -u cloudflare-tunnel -n 50 | grep trycloudflare.com
