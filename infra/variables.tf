variable "db_username" {
  description = "Database administrator username"
  type        = string
  default     = "appuser"
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "firebase_service_account_key" {
  description = "Firebase service account key"
  type        = string
  sensitive   = true
}