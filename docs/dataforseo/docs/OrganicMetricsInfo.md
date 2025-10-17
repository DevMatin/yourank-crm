# OrganicMetricsInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**type** | **string** | type of element |[optional]|
**timestamp** | **string** | date and time of the value readout<br>in the UTC format: “yyyy-mm-dd hh-mm-ss +00:00”<br>example:<br>2025-02-10 09:40:00 +00:00 |[optional]|
**revenue** | **number** | revenue value |[optional]|
**revenue_delta** | **number** | change in revenue |[optional]|
**operating_expense** | **number** | operating expense value |[optional]|
**operating_expense_delta** | **number** | change in operating expense |[optional]|
**net_income** | **number** | net income value |[optional]|
**net_income_delta** | **number** | change in net income |[optional]|
**net_profit_margin** | **number** | net profit margin value |[optional]|
**net_profit_margin_delta** | **number** | change in net profit margin |[optional]|
**earnings_per_share** | **number** | earnings per share value |[optional]|
**earnings_per_share_delta** | **number** | change in earnings per share |[optional]|
**ebitda** | **number** | earnings before interest, taxes, deprecation, amortisation |[optional]|
**ebitda_delta** | **number** | change in ebitda |[optional]|
**effective_tax_rate** | **number** | effective tax rate value |[optional]|
**cash_and_short_term_investments** | **number** | cash and short-term investments value |[optional]|
**cash_and_short_term_investments_delta** | **number** | change in cash and short-term investments |[optional]|
**total_assets** | **number** | total assets value |[optional]|
**total_assets_delta** | **number** | change in total assets |[optional]|
**total_liabilities** | **number** | total liabilities value |[optional]|
**total_liabilities_delta** | **number** | change in total liabilities |[optional]|
**total_equity** | **number** | total equity value |[optional]|
**shares_outstanding** | **number** | outstanding shares value |[optional]|
**price_to_book** | **number** | price to book |[optional]|
**return_on_assets** | **number** | return on assets |[optional]|
**return_on_capital** | **number** | return on capital |[optional]|
**cash_from_operations** | **number** | cash from operations |[optional]|
**cash_from_operations_delta** | **number** | change in cash from operations |[optional]|
**cash_from_investing** | **number** | cash from investing |[optional]|
**cash_from_investing_delta** | **number** | change in cash from investing |[optional]|
**cash_from_financing** | **number** | cash from financing/em> |[optional]|
**cash_from_financing_delta** | **number** | change in cash from financing |[optional]|
**net_change_in_cash** | **number** | net change in cash |[optional]|
**net_change_in_cash_delta** | **number** | change in net change in cash |[optional]|
**free_cash_flow** | **number** | free cash flow value |[optional]|
**free_cash_flow_delta** | **number** | change in free cash flow |[optional]|
**pos_1** | **number** | number of organic SERPs where the domain ranks #1 |[optional]|
**pos_2_3** | **number** | number of organic SERPs where the domain ranks #2-3 |[optional]|
**pos_4_10** | **number** | number of organic SERPs where the domain ranks #4-10 |[optional]|
**pos_11_20** | **number** | number of organic SERPs where the domain ranks #11-20 |[optional]|
**pos_21_30** | **number** | number of organic SERPs where the domain ranks #21-30 |[optional]|
**pos_31_40** | **number** | number of organic SERPs where the domain ranks #31-40 |[optional]|
**pos_41_50** | **number** | number of organic SERPs where the domain ranks #41-50 |[optional]|
**pos_51_60** | **number** | number of organic SERPs where the domain ranks #51-60 |[optional]|
**pos_61_70** | **number** | number of organic SERPs where the domain ranks #61-70 |[optional]|
**pos_71_80** | **number** | number of organic SERPs where the domain ranks #71-80 |[optional]|
**pos_81_90** | **number** | number of organic SERPs where the domain ranks #81-90 |[optional]|
**pos_91_100** | **number** | number of organic SERPs where the domain ranks #91-100 |[optional]|
**etv** | **number** | estimated traffic volume<br>estimated organic monthly traffic to the domain<br>calculated as the product of CTR (click-through-rate) and search volume values of all keywords the domain ranks for<br>learn more about how the metric is calculated in this help center article |[optional]|
**count** | **number** | total count of organic SERPs that contain the domain |[optional]|
**estimated_paid_traffic_cost** | **number** | estimated cost of converting organic search traffic into paid<br>represents the estimated monthly cost of running ads (USD) for all keywords a domain ranks for<br>the metric is calculated as the product of organic etv and paid cpc values and indicates the cost of driving the estimated volume of monthly organic traffic through PPC advertising in Google Search<br>learn more about how the metric is calculated in this help center article |[optional]|
**is_new** | **number** | number of new ranked elements<br>indicates how many new ranked elements were found for this domain |[optional]|
**is_up** | **number** | rank went up<br>indicates how many ranked elements of this domain went up in Google Search |[optional]|
**is_down** | **number** | rank went down<br>indicates how many ranked elements of this domain went down in Google Search |[optional]|
**is_lost** | **number** | lost ranked elements<br>indicates how many ranked elements of this domain were previously presented in SERPs, but weren’t found during the last check |[optional]|