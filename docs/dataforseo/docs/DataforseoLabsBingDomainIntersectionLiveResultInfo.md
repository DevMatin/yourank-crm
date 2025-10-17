# DataforseoLabsBingDomainIntersectionLiveResultInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**se_type** | **string** | search engine type<br>search engine type specified in a POST request;<br>for this endpoint, the field equals bing |[optional]|
**target_1** | **string** | target specified in a POST array |[optional]|
**target_2** | **string** | target specified in a POST array |[optional]|
**location_code** | **number** | location code in a POST array |[optional]|
**language_code** | **string** | language code in a POST array |[optional]|
**total_count** | **number** | total amount of results in our database relevant to your request |[optional]|
**items_count** | **number** | the number of results returned in the items array |[optional]|
**items** | **DataforseoLabsDomainIntersectionLiveItem[]** | contains keywords, relevant SERP elements and related data |[optional]|