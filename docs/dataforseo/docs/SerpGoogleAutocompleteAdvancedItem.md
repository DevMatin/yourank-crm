# SerpGoogleAutocompleteAdvancedItem

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**type** | **string** | type of element |[optional]|
**rank_group** | **number** | group rank in SERP<br>position within a group of elements with identical type values<br>positions of elements with different type values are omitted from rank_group |[optional]|
**rank_absolute** | **number** | absolute rank in SERP<br>absolute position among all the elements in SERP |[optional]|
**relevance** | **number** | relevance of suggested keyword<br>represents the relevant of the autocomplete suggestion to the target keyword<br>can take values from 500 to 2000<br>the higher the value, the more relevant is the suggestion<br>Note: only available for the following client:<br>chrome/chrome-omni |[optional]|
**suggestion** | **string** | google autocomplete keyword suggestion |[optional]|
**suggestion_type** | **string** | google autocomplete suggestion type<br>Note: only available for the following client:<br>chrome/chrome-omni |[optional]|
**search_query_url** | **string** | url to search results<br>url to search results relevant to the google autocomplete suggestion |[optional]|
**thumbnail_url** | **string** | url of the thumbnail image<br>url of the thumbnail image of the google autocomplete suggestion<br>Note: only available for the following client:<br>gws-wiz<br>gws-wiz-serp |[optional]|
**highlighted** | **string[]** | keywords highlighted in autocomplete<br>contains a list of google autocomplete suggestions that are highlighted in the search bar;<br>Note: array is only available for the following client:<br>gws-wiz<br>psy-ab<br>gws-wiz-local |[optional]|