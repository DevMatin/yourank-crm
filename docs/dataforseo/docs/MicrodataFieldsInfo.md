# MicrodataFieldsInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**name** | **string** | field name<br>name of the data field |[optional]|
**types** | **string[]** | list of microdata types |[optional]|
**value** | **string** | microdata value<br>microdata value specified on a target web page |[optional]|
**test_results** | **MessageInfo** | microdata validation test results<br>sub-type microdata test results that contain detected errors and related messages |[optional]|
**fields** | **MicrodataFieldsInfo[]** | microdata fields<br>an array of objects containing data fields related to the certain microdata type |[optional]|