# DataforseoLabsLocationsAndLanguagesResultInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**location_code** | **number** | location code |[optional]|
**location_name** | **string** | full name of the location |[optional]|
**location_code_parent** | **number** | the code of the superordinate location<br>the value will be null as Country is the only supported location_type for this API |[optional]|
**country_iso_code** | **string** | ISO country code of the location |[optional]|
**location_type** | **string** | location type<br>possible values:<br>Country |[optional]|
**available_languages** | **AvailableLanguages[]** | supported languages<br>contains the languages which are supported for a specific location |[optional]|