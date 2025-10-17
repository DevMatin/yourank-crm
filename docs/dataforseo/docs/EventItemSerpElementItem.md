# EventItemSerpElementItem

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**title** | **string** | title of the element |[optional]|
**description** | **string** | description of the results element in SERP |[optional]|
**url** | **string** | search URL with refinement parameters |[optional]|
**image_url** | **string** | URL of the image featured in the element |[optional]|
**event_dates** | **EventDates** | dates when the event takes place<br>if there are none, equals null |[optional]|
**location_info** | **LocationInfo** | information about the event’s venue |[optional]|
**information_and_tickets** | **InformationAndTicketsElement[]** | additional information and ticket purchase options |[optional]|