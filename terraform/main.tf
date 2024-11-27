provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "my_instance" {
  ami           = "ami-0c02fb55956c7d316" # Reemplaza con tu AMI adecuada (Ubuntu, Amazon Linux, etc.)
  instance_type = "t2.micro"

  security_groups = [
    aws_security_group.ec2_sg.name
  ]

  # Configuración para instalar Docker y ejecutar docker-compose
  user_data = <<-EOF
    #!/bin/bash
    sudo apt-get update -y
    sudo apt-get install -y docker.io
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # Crear el directorio para almacenar el proyecto
    mkdir -p /home/ubuntu/backend
    cd /home/ubuntu/backend

    # Copiar el archivo docker-compose.production.yml desde tu directorio
    cat <<DOCKER_COMPOSE > docker-compose.production.yml
    ${file("../docker-compose.production.yml")}
    DOCKER_COMPOSE

    # Ejecutar Docker Compose
    sudo docker-compose -f docker-compose.production.yml up -d
  EOF

  tags = {
    Name = "BackendEC2"
  }
}

# Security group para permitir tráfico en los puertos necesarios
resource "aws_security_group" "ec2_sg" {
  name_prefix = "allow_http"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 1884
    to_port     = 1884
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




resource "aws_eip" "ec2_eip" {
  instance = aws_instance.my_instance.id
  tags = {
    Name = "EC2 Elastic IP"
  }
}

# Crear un bucket S3
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-project-bucket-${random_id.bucket_id.hex}"

  tags = {
    Name        = "MyProjectBucket"
    Environment = "Dev"
  }
}

# Configurar el versionado para el bucket S3
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.my_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}


resource "random_id" "bucket_id" {
  byte_length = 4
}

resource "aws_api_gateway_rest_api" "my_api" {
  name        = "MyProjectAPI"
  description = "API Gateway for My Project"
}

resource "aws_api_gateway_resource" "fixtures" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "fixtures"
}

resource "aws_api_gateway_method" "get_fixtures" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.fixtures.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_fixtures_integration" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.fixtures.id
  http_method             = aws_api_gateway_method.get_fixtures.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_instance.my_instance.public_ip}:80/fixtures"
}

resource "aws_api_gateway_resource" "bets" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "bets"
}

resource "aws_api_gateway_method" "post_bets" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.bets.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_bets_integration" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.bets.id
  http_method             = aws_api_gateway_method.post_bets.http_method
  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${aws_instance.my_instance.public_ip}:80/bets"
}


resource "aws_api_gateway_stage" "prod_stage" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  stage_name  = "prod"
  deployment_id = aws_api_gateway_deployment.my_deployment.id
}

resource "aws_api_gateway_deployment" "my_deployment" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id

  depends_on = [
    aws_api_gateway_method.get_fixtures,
    aws_api_gateway_method.post_bets
  ]
}


output "api_gateway_url" {
  value = "${aws_api_gateway_stage.prod_stage.invoke_url}/root"  # Ajuste para apuntar a la raíz correctamente
}

output "api_gateway_fixtures_url" {
  value = "${aws_api_gateway_stage.prod_stage.invoke_url}/fixtures"
}

output "api_gateway_bets_url" {
  value = "${aws_api_gateway_stage.prod_stage.invoke_url}/bets"
}


output "ec2_public_ip" {
  value = aws_eip.ec2_eip.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.my_bucket.bucket
}
