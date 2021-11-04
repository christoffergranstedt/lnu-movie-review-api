## Movie Review REST API

An API i did at a course at Linnaeus University where to goal was to follow as many restful rules as possible. Some HATEOAS is implemented so it should be possible to follow the home route for links. 


#### API Routes
GET -	'/' -	The home of the API. Will show some links to the resources.

POST - '/accounts/register' - New users can register themselves here by providing username and password  
POST - '/accounts/authenticate' - User can authenticate and get access token and refresh token by providing username and password  
POST - '/accounts/refresh' - If an access token has expired, by providing the refresh token you can get a new access token and refresh token

GET - '/movies' - Get all movies. Open for everyone.  
GET - '/movies/{movie}' - Get a specific movie. Open for everyone.  
POST - '/movies' - Create a new movie. Only authenticated and authorized user (Admin permission level).  
PUT - '/movies/{movie}' -	Update a movie. Only authenticad and authorized user (Admin permisson level).  
DELETE - '/movies/{movie}' - Delete a movie. Only authenticad and authorized user (Admin permisson level).  

GET - '/movies/{movie}/webhooks/{webhook}' - Get a webhook. Only authenticad and authorized user.   
POST - '/movies/{movie}/webhooks'	-	Create a webhook. Only authenticad and authorized user.  
DELETE - '/movies/{movie}/webhooks/{webhook}' - Delete a webhook. Only authenticad and authorized user.  

GET - '/movies/{movie}/reviews' -	Get all movie reviews for a specific movie. Open for everyone.  
GET - '/movies/{movie}/reviews/{review}' - Get a specific movie review for a specific movie. Open for everyone.  
POST - '/movies/{movie}/reviews/'	-	Create a new movie. Only authenticated user.  
PUT - '/movies/{movie}/reviews/{review}' - Update a movie review. Only authenticad and authorized user.  
DELETE - '/movies/{movie}/reviews/{review}'	-	Delete a movie review. Only authenticad and authorized user.  