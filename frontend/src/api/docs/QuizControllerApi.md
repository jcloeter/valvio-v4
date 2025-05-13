# QuizControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllQuizzes**](#getallquizzes) | **GET** /quiz | |
|[**startQuiz**](#startquiz) | **POST** /quiz/{id}/start | |

# **getAllQuizzes**
> Array<QuizResponseDto> getAllQuizzes()


### Example

```typescript
import {
    QuizControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizControllerApi(configuration);

const { status, data } = await apiInstance.getAllQuizzes();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<QuizResponseDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **startQuiz**
> QuizAttemptResponseDto startQuiz()


### Example

```typescript
import {
    QuizControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.startQuiz(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**QuizAttemptResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

