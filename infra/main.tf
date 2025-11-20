terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
  profile = "default"
}

resource "aws_instance" "valvio_api_server" {
  ami           = "ami-0f34c5ae932e6f0e4"
  instance_type = "t2.micro"
  key_name      = "valvio-key"  # SSH key pair name (without .pem extension)

  subnet_id = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]

  tags = {
    Name = "Valvio API Server"
  }

user_data = <<-EOF
  #!/bin/bash
  yum update -y
  yum install -y java-17-amazon-corretto-devel
  mkdir -p /app
  chown ec2-user:ec2-user /app
EOF
}

data "aws_vpc" "default" {
  default = true
}

# Data source for default VPC subnets
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_db_subnet_group" "valvio_db_subnet_group" {
  name       = "valvio-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "Valvio DB subnet group"
  }
}

# Security Group for EC2
resource "aws_security_group" "ec2_sg" {
  name   = "ec2-security-group"
  vpc_id = data.aws_vpc.default.id
  
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name   = "rds-security-group"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# RDS Instance (Free Tier Eligible)
resource "aws_db_instance" "valvio_api_db" {
  identifier = "spring-app-db"
  
  # Database Configuration
  engine         = "postgres"
  engine_version = "17.6"
  instance_class = "db.t3.micro"  # Free tier eligible
  
  # Storage
  allocated_storage     = 20  # Free tier allows up to 20GB
  max_allocated_storage = 20  # Prevent auto-scaling
  storage_type          = "gp2"
  storage_encrypted     = false  # Keep costs down

  # Credentials
  db_name  = "springappdb"
  username = var.db_username
  password = var.db_password
    
  # Network & Security
  db_subnet_group_name   = aws_db_subnet_group.valvio_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = false
  
  # Backup & Maintenance
  backup_retention_period = 0  # Disable backups to save costs
  skip_final_snapshot    = true
  deletion_protection    = false
  
  # Maintenance
  auto_minor_version_upgrade = true
  maintenance_window        = "sun:03:00-sun:04:00"
  
  tags = {
    Name = "Spring App Database"
  }
}

# Output database endpoint
output "rds_endpoint" {
  value = aws_db_instance.valvio_api_db.endpoint
}



