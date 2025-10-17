# DictionarySerpElementItem

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**rank_group** | **number** | group rank in SERP<br>position within a group of elements with identical type values<br>positions of elements with different type values are omitted from rank_group |[optional]|
**rank_absolute** | **number** | absolute rank in SERP<br>absolute position among all the elements in SERP |[optional]|
**title** | **string** | title of the result in SERP |[optional]|
**url** | **string** | relevant URL of the Ad element in SERP |[optional]|
**domain** | **string** | domain in SERP |[optional]|
**breadcrumb** | **string** | breadcrumb of the Ad element in SERP |[optional]|
**keyword** | **string** | keyword highlighted in the result |[optional]|
**snippet** | **string** | snippet of the element |[optional]|
**text** | **string** | description of the results element in SERP |[optional]|
**links** | **LinkElement[]** | sitelinks<br>the links shown below some of search results<br>if there are none, equals null |[optional]|