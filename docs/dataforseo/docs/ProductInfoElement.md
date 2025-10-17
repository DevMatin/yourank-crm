# ProductInfoElement

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**type** | **string** | type of element |[optional]|
**rank_group** | **number** | position within a group of elements with identical type values<br>positions of elements with different type values are omitted from rank_group |[optional]|
**rank_absolute** | **number** | absolute rank on the product specification page<br>absolute position among all the elements found on the product specification page |[optional]|
**position** | **string** | alignment of the element on the product specification page<br>can take the following values:<br>right, left |[optional]|
**product_id** | **string** | product_id received in a POST array<br>ilearn more about the parameter in this help center guide |[optional]|
**title** | **string** | title of the product |[optional]|
**description** | **string** | description of the product |[optional]|
**url** | **string** | product url<br>url of the product on Google Shopping |[optional]|
**images** | **string[]** | product images<br>contains urls to product images |[optional]|
**features** | **string[]** | product features<br>contains snippets with the description of product features |[optional]|
**rating** | **RatingElement** | product rating <br>the popularity rate based on reviews |[optional]|
**seller_reviews_count** | **number** | number of seller reviews<br>number of reviews on the product seller’s account |[optional]|
**sellers** | **ProductSeller[]** | sellers of the product<br>number of reviews on the product seller’s account |[optional]|
**variations** | **ProductVariation[]** | variations of the product<br>contains brief information about different product variations |[optional]|