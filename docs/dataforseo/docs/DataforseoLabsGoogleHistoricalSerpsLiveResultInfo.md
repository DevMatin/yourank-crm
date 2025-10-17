# DataforseoLabsGoogleHistoricalSerpsLiveResultInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**se_type** | **string** | search engine type |[optional]|
**keyword** | **string** | keyword received in a POST array<br>the keyword is returned with decoded %## (plus character ‘+’ will be decoded to a space character) |[optional]|
**location_code** | **number** | location code in a POST array |[optional]|
**language_code** | **string** | language code in a POST array |[optional]|
**total_count** | **number** | the number of results returned in the items array |[optional]|
**items_count** | **number** | the number of results returned in the items array |[optional]|
**items** | **DataforseoLabsGoogleHistoricalSerpsLiveItem[]** | contains arrays of specific images |[optional]|