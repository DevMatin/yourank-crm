# ContentGenerationTextSummaryLiveResultInfo

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
**sentences** | **number** | number of sentences found in the target text |[optional]|
**paragraphs** | **number** | number of paragraphs found in the target text |[optional]|
**words** | **number** | number of words found in the target text |[optional]|
**characters_without_spaces** | **number** | number of characters without spaces found in the target text |[optional]|
**characters_with_spaces** | **number** | number of characters with spaces found in the target text |[optional]|
**words_per_sentence** | **number** | average number of words per sentence in the target text |[optional]|
**characters_per_word** | **number** | average number of characters per word in the target text |[optional]|
**vocabulary_density** | **number** | vocabulary density of the target text |[optional]|
**keyword_density** | **{ [key: string]: number; }** | keyword density of the target text<br>contains most common words and their count |[optional]|
**automated_readability_index** | **number** | Automated Readability Index |[optional]|
**coleman_liau_index** | **number** | Coleman–Liau Index |[optional]|
**flesch_kincaid_grade_level** | **number** | Flesch–Kincaid Readability Index |[optional]|
**smog_readability_index** | **number** | SMOG Readability Index |[optional]|
**spelling_errors** | **number** | number of spelling errors found in the target text |[optional]|
**grammar_errors** | **number** | number of grammar errors found in the target text |[optional]|