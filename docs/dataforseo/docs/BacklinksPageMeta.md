# BacklinksPageMeta

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**title** | **string** | page title |[optional]|
**canonical** | **string** | canonical page |[optional]|
**internal_links_count** | **number** | number of internal links on the page |[optional]|
**external_links_count** | **number** | number of external links on the page |[optional]|
**images_count** | **number** | number of images on the page |[optional]|
**words_count** | **number** | number of words on the page |[optional]|
**page_spam_score** | **number** | spam score of the page<br>learn more about how the metric is calculated on this help center page |[optional]|
**social_media_tags** | **{ [key: string]: string; }** | array of social media tags found on the page<br>contains social media tags and their content<br>supported tags include but are not limited to Open Graph and Twitter card |[optional]|
**h_1** | **string[]** | h1 tag<br>content of h1 tags |[optional]|
**h_2** | **string[]** | h2 tag<br>content of h2 tags |[optional]|
**h_3** | **string[]** | h3 tag<br>content of h3 tags |[optional]|
**images_alt** | **string[]** | content of alt tags |[optional]|
**powered_by** | **string[]** | CMS details |[optional]|
**language** | **string** | page content language<br>example:<br>en |[optional]|
**charset** | **string** | character encoding<br>examples:<br>utf-8 |[optional]|
**platform_type** | **string[]** | type of a platform |[optional]|
**technologies** | **{ [key: string]: string; }** | website technologies |[optional]|