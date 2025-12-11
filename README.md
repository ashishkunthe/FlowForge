#routes

1:-"/auth/signup":POST
payload:
{
username:"",
email:"",
password:""
}

2:-"/auth/signin":POST
payload:
{
email:"",
password:""
}

3:- "/idea/create":POST
payload:headers : authenctication token
{ title:"",
mainIdea:"",
howToAchieve:"",
motivation:"" }

4:- "/idea/all":GET
payload :headers : authenctication token

5:-"/idea/:id":GET
payload :headers : authenctication token
