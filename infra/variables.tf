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