# MerchantGoogleProductSpecTaskGetAdvancedResultInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**product_id** | **string** | product ID in a POST array<br>learn more about the parameter in this help center guide |[optional]|
**type** | **string** | type of element |[optional]|
**se_domain** | **string** | search engine domain in a POST array |[optional]|
**location_code** | **number** | location code in a POST array |[optional]|
**language_code** | **string** | language code in a POST array |[optional]|
**title** | **string** | title of the product |[optional]|
**description** | **string** | description of the product |[optional]|
**image_url** | **string** | URL of the product image |[optional]|
**tags** | **string[]** | tags of the product |[optional]|
**check_url** | **string** | direct URL to search engine results<br>you can use it to make sure that we provided accurate results |[optional]|
**datetime** | **string** | date and time when the result was received<br>in the format: “year-month-date:minutes:UTC_difference_hours:UTC_difference_minutes”<br>example:<br>2019-11-15 12:57:46 +00:00 |[optional]|
**item_types** | **string[]** | types of items found on the product specification page<br>possible item types:<br>shopping_specification |[optional]|
**items_count** | **number** | the number of results returned in the items array |[optional]|
**items** | **ShoppingSpecification[]** | items on the product specification page<br>contains all product attributes and related data listed on the product specification page |[optional]|