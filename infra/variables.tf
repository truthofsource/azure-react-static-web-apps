variable "location" {
  type = string
}

variable "name" {
  type = string
}

variable "enable_custom_domains" {
  default = false
  type    = bool
}

variable "public_application_hostname" {
  default = "apply.example.invalid"
  type    = string
}

variable "private_portal_hostname" {
  default = "portal.example.invalid"
  type    = string
}

variable "tags" {
  type = map(string)
}

variable "sku" {
  default = "Free"
  type    = string
}

variable "resource_group_name" {
  type = string
}
