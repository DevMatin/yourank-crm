# AmazonAmazonPaidSerpElementItem

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**se_type** | **string** | search engine type |[optional]|
**domain** | **string** | Amazon domain |[optional]|
**title** | **string** | product title |[optional]|
**url** | **string** | URL of the product page |[optional]|
**asin** | **string** | ASIN of the product<br>learn more about ASIN in this help center guide |[optional]|
**image_url** | **string** | URL of the product image featured in the results |[optional]|
**price_from** | **number** | the regular price of a product<br>example:<br>49.98 |[optional]|
**price_to** | **number** | the upper limit of the product price range<br>example:<br>384.99 |[optional]|
**currency** | **string** | currency in the ISO format<br>example:<br>USD |[optional]|
**special_offers** | **string[]** | special offer details<br>contains special offer details, including coupon and Subscribe & Save discounts |[optional]|
**is_best_seller** | **boolean** | “Best Seller” label<br>if the value is true, the product is marked with the “Best Seller” label |[optional]|
**is_amazon_choice** | **boolean** | “Amazon’s choice” label<br>if the value is true, the product is marked with the “Amazon’s choice” label |[optional]|
**rating** | **BusinessDataRatingInfo** | the item’s rating <br>the popularity rate based on reviews and displayed in SERP |[optional]|
**delivery_info** | **AmazonDeliveryInfo** | delivery information<br>delivery information including free and fast delivery date ranges |[optional]|
**bought_past_month** | **number** | number of product purchases in the past month |[optional]|
**data_asin** | **string** | unique product identifier on Amazon<br>note that there is no full list of possible values as the data_asin is a dynamic value assigned by Amazon<br>example:<br>B07G82D89J |[optional]|