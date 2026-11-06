mock_provider "azurerm" {}
variables {
  subscription_id     = "00000000-0000-4000-8000-000000000010"
  name                = "swa-example-frontend"
  resource_group_name = "rg-example-web"
  location            = "centralus"
  tags                = { environment = "reference", owner = "engineering" }
}
run "free_sku_and_no_domain_activation" {
  command = plan
  assert {
    condition     = azurerm_static_web_app.workforce_portal.sku_tier == "Free" && azurerm_static_web_app.workforce_portal.sku_size == "Free" && length(azurerm_static_web_app_custom_domain.public_application) == 0 && length(azurerm_static_web_app_custom_domain.private_portal) == 0
    error_message = "Preserve the source Free SKU and default-Off domain commissioning."
  }
}
run "reviewed_domains_are_explicit" {
  command = plan
  variables { enable_custom_domains = true }
  assert {
    condition     = azurerm_static_web_app_custom_domain.public_application[0].domain_name == "apply.example.invalid" && azurerm_static_web_app_custom_domain.private_portal[0].domain_name == "portal.example.invalid" && azurerm_static_web_app_custom_domain.public_application[0].validation_type == "cname-delegation"
    error_message = "Explicit hostnames and delegation method required."
  }
}
