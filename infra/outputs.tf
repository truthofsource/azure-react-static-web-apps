output "resource_group_name" {
  value = azurerm_resource_group.web_nonproduction.name
}

output "id" {
  value = azurerm_static_web_app.workforce_portal.id
}

output "name" {
  value = azurerm_static_web_app.workforce_portal.name
}

output "default_host_name" {
  value = azurerm_static_web_app.workforce_portal.default_host_name
}

output "public_application_hostname" {
  value = try(azurerm_static_web_app_custom_domain.public_application[0].domain_name, null)
}

output "private_portal_hostname" {
  value = try(azurerm_static_web_app_custom_domain.private_portal[0].domain_name, null)
}
