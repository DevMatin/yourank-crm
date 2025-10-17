# PaidDataforseoLabsSerpElementItem

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**se_type** | **string** | search engine type |[optional]|
**title** | **string** | title of the result in SERP |[optional]|
**domain** | **string** | domain in SERP |[optional]|
**description** | **string** | description of the results element in SERP |[optional]|
**breadcrumb** | **string** | breadcrumb in SERP |[optional]|
**url** | **string** | sitelink URL |[optional]|
**highlighted** | **string[]** | words highlighted in bold within the results description |[optional]|
**extra** | **{ [key: string]: string; }** | additional information about the result |[optional]|
**description_rows** | **string[]** | extended description<br>if there is none, equals null |[optional]|
**links** | **AdLinkElement[]** | sitelinks<br>the links shown below some of Google’s search results<br>if there are none, equals null |[optional]|
**main_domain** | **string** | primary domain name in SERP |[optional]|
**relative_url** | **string** | URL in SERP that does not specify the HTTPs protocol and domain name |[optional]|
**etv** | **number** | estimated traffic volume<br>estimated organic monthly traffic a featured URL delivers to the domain<br>calculated as the product of CTR (click-through-rate) and search volume values of the returned keyword<br>learn more about how the metric is calculated in this help center article |[optional]|
**estimated_paid_traffic_cost** | **number** | estimated cost of paid monthly search traffic<br>represents the estimated cost of paid monthly traffic based on etv and cpc values<br>learn more about how the metric is calculated in this help center article |[optional]|
**clickstream_etv** | **number** |  |[optional]|
**rank_changes** | **RankChanges** | changes in rankings<br>ranking changes of the SERP element compared to the preceding month;<br>Note: the changes are calculated even if the preceding month is not included in a POST request |[optional]|
**backlinks_info** | **BacklinksInfo** | backlinks information for the ranked website |[optional]|
**rank_info** | **RankInfo** | page and domain rank information |[optional]|