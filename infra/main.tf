resource "azurerm_resource_group" "web_nonproduction" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

resource "azurerm_static_web_app" "workforce_portal" {
  name                = var.name
  resource_group_name = azurerm_resource_group.web_nonproduction.name
  location            = azurerm_resource_group.web_nonproduction.location

  sku_tier = var.sku
  sku_size = var.sku

  tags = var.tags

  lifecycle {
    ignore_changes = [
      repository_branch,
      repository_url,
    ]
  }
}

resource "azurerm_static_web_app_custom_domain" "public_application" {
  count             = var.enable_custom_domains ? 1 : 0
  static_web_app_id = azurerm_static_web_app.workforce_portal.id
  domain_name       = var.public_application_hostname
  validation_type   = "cname-delegation"
}

resource "azurerm_static_web_app_custom_domain" "private_portal" {
  count             = var.enable_custom_domains ? 1 : 0
  static_web_app_id = azurerm_static_web_app.workforce_portal.id
  domain_name       = var.private_portal_hostname
  validation_type   = "cname-delegation"
}
