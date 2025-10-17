# TripadvisorReviewSearchBusinessDataSerpElementItem

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**position** | **string** | the alignment of the review in SERP<br>can take the following values: right |[optional]|
**url** | **string** | URL of the review |[optional]|
**rating** | **BusinessDataRatingInfo** | the rating score submitted by the reviewer |[optional]|
**date_of_visit** | **string** | date of the reviewer’s visit to the local establishment<br>in the UTC format: “yyyy-mm-dd hh-mm-ss +00:00”<br>example:<br>2019-11-15 12:57:46 +00:00 |[optional]|
**timestamp** | **string** | date and time when the review was published<br>in the UTC format: “yyyy-mm-dd hh-mm-ss +00:00”<br>example:<br>2019-11-15 12:57:46 +00:00 |[optional]|
**title** | **string** | title of the review |[optional]|
**review_text** | **string** | content of the review |[optional]|
**review_images** | **ImageUrlInfo[]** | contains URLs of the images used in the review |[optional]|
**user_profile** | **BusinessDataUserProfileInfo** | information from the reviewer’s profile |[optional]|
**responses** | **ReviewResponseItemInfo[]** | contains information about the owner’s response |[optional]|
**review_highlights** | **any** | review highlights<br>contains highlighted review criteria and assessments |[optional]|