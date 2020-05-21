var app = angular.module("testApp", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    resolve:{  
        check:function($location,user){
              if(localStorage.getItem("loggedin")){
                  $location.path("/control");
              }

          }
        },
    templateUrl : "login.html",
    controller : 'loginControl'
  })
    
  
    

  .when("/user", {
      resolve:{  
    check:function($location,user){
          if(!localStorage.getItem("loggedin") ){
              $location.path("/");
          }
          if(localStorage.getItem("type")==0)
          {
              $location.path("/control");
          }
      }
    },
    templateUrl : "user.html",
    controller : 'testControl'
  })

  .when("/control", {
    resolve:{  
    check:function($location,user){
          if(!localStorage.getItem("loggedin") ){
              $location.path("/");
          }
          if(localStorage.getItem("type")==1)
          {
              $location.path("/user");
          }
      }
    },
    templateUrl : "front.html",
    controller : 'testControl'
  })

  
  .when("/student", {
    resolve:{  
    check:function($location,user){
          if(!localStorage.getItem("loggedin") ){
              $location.path("/");
          }
          if(localStorage.getItem("type")==1)
          {
              $location.path("/user");
          }
      }
    },
    templateUrl : "student.html",
    controller : 'testControl'
  })

  
});


app.service('user',function(){
    var username;
    var loggedin=false;
    this.setname=function(name){
        username=name;
    } 
    this.getname=function(){
        return username;
    }
    this.userlogin=function(logedin)
    {
        loggedin=logedin;
    }
    this.isloggedin=function()
    {
        return loggedin;
    }
    var type;
    this.settype=function(name)
    {
        type=name;
    }
    this.gettype=function()
    {
        return type;
    }

    var unid;
    this.setid=function(name)
    {
        unid=name;
    }
    this.getid=function()
    {
        return unid;
    }
});

app.controller('loginControl',function($scope,$location,user, $http){

    $scope.invalidcred=false;
    $scope.loginchoice='admin';
    $scope.loginmain=function()
    {
        console.log("login stared");
        console.log($scope.loginchoice);

        var choi;
        if($scope.loginchoice=='admin')
        {
            choi=0;
        }
        else
        {
            choi=1;
        }
        var newurl="https://tpomanagementsystem.herokuapp.com/tpo/getlogin/"+$scope.loguname+"/"+$scope.logpassword+"/"+choi;
        console.log(newurl);

        $http.get(newurl).then(
            function(response){

            $scope.data=response.data;

            if($scope.data.uname!="$$invalid$$")
            {
                console.log("login sucessfull");
                user.setname($scope.data.uname);
                user.userlogin(true);
                localStorage.setItem('username',$scope.data.uname);
                localStorage.setItem('loggedin',true);
                localStorage.setItem('type',choi);
                
                if(choi==0)
                {$location.path("/control");
                
            }
            else
            {
                $location.path("/user");
            }
                
            }
            else
            {
                $scope.invalidcred=true;
                console.log("login unsucessfull");
                $location.path("/");
            }

            });



       
    }
});




app.controller('testControl',function($scope,$location,user,$http,$interval){

    
    $scope.reset=function(){
        $scope.Submit="Submit";
        $scope.idReadOnly=false;
        $scope.id=null;
        $scope.name=null;
        $scope.mobile=null;
        $scope.profile=null;
        $scope.score=null;
        $scope.backlog=null;
        $scope.date=null;
        $scope.email=null;
        
        $scope.description=null;
        $scope.disableSubmit=false;
        $scope.usedId=false;
        $scope.modalMessage="Insert Data";
        $scope.currentDeleteId=null;
        $scope.usedName=false;
        $scope.usedlicense=false;
        $scope.loggedinas=user.getname();
        $scope.loggedinas=localStorage.getItem('username')
        $scope.datalog=null;
        $scope.loginchoice='admin'
        $scope.gotdata=false;
        $scope.nologdata=false;
        $scope.extra=false;
        $scope.branches=["CS","IT","MECH","EEE","others"]
        $scope.branch="CS";
        $scope.ipass=null;
        $scope.cpass=null;
        $scope.stud=null;
        $scope.fetchdata=null;
        $scope.count=null;
    }


    $scope.getIds=function(ecode)
    {
        var url="https://tpomanagementsystem.herokuapp.com/tpo/getreg/"+ecode.toString();
        console.log(url);
        $http.get(url).then(
            function(response){
                $scope.count=response.data.length;
            $scope.fetchdata=response.data;
            });
            console.log(fetchdata)
            
    }
    
    $scope.delete2=function(ecode)
    {
        console.log(ecode);
        var url="https://tpomanagementsystem.herokuapp.com/tpo/deletelogin/"+ecode.toString();
        console.log(url);
        $http.get(url).then(
            function(response){
            $scope.datax=response.data;
            });
            
        var url="https://tpomanagementsystem.herokuapp.com/tpo/deletestudent/"+ecode.toString();
        console.log(url);
        $http.get(url).then(
            function(response){
            $scope.studdata=response.data;
            });
        $scope.reset();
    }


   
    $scope.checkf=function()
    {
        if($scope.loginchoice.toString()=='admin')
        $scope.extra=false;
        else
        {
        $scope.extra=true;
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getallstudent")
        .then(function(response) {
            console.log(response.data);
                $scope.studdata=response.data;
              });
        }
    }

    $scope.reset();
    $scope.validateName=function(){
        


        if(!$scope.idReadOnly)
        {
        console.log("key pressed");
        var flag=0;
        for(var i=0;i<$scope.data3.length;i++)
        {
            if($scope.name==$scope.data3[i].uname)
            flag=1;
        }


        if(flag==1)
        {
            $scope.disableSubmit=true;
            $scope.usedName=true;
            console.log("submit disabled");
        }
        else
        {
            $scope.disableSubmit=false;
            $scope.usedName=false;
            console.log("submit enabled");
        }
    }
    };

    $scope.validateName2=function(){
        


        if(!$scope.idReadOnly)
        {
        console.log("key pressed");
        var flag=0;
        for(var i=0;i<$scope.data3.length;i++)
        {
            if($scope.name==$scope.data3[i].uname && $scope.data3[i].type==1)
            flag=1;
        }


        if(flag==1)
        {
            $scope.disableSubmit=false;
            $scope.usedName=false;
            console.log("submit enabled");
        }
        else
        {
            $scope.disableSubmit=true;
            $scope.usedName=true;
            console.log("submit disabled");
        }
    }
    };


    $scope.validateLicense=function(){
        if(!$scope.idReadOnly)
        {
        console.log("key pressed");
        var flag=0;
        
        for(var i=0;i<$scope.data.length;i++)
        {
            if($scope.license==$scope.data[i].license)
            flag=1;
        }


        if(flag==1)
        {
            $scope.disableSubmit=true;
            $scope.usedlicense=true;
            console.log("submit disabled");
        }
        else
        {
            $scope.disableSubmit=false;
            $scope.usedlicense=false;
            console.log("submit enabled");
        }
    }
    };


    $scope.validateemail=function()
    {
        var email=$scope.email.toString();

    }


    $scope.validateId=function(){
        if(!$scope.idReadOnly)
        {
        console.log("key pressed");
        var flag=0;
        for(var i=0;i<$scope.studdata.length;i++)
        {
            if($scope.id==$scope.studdata[i].id)
            flag=1;
        }


        if(flag==1)
        {
            $scope.disableSubmit=true;
            $scope.usedId=true;
            console.log("submit disabled");
        }
        else
        {
            $scope.disableSubmit=false;
            $scope.usedId=false;
            console.log("submit enabled");
        }


        // $scope.changesub=false;
        // $scope.getfinalcardata=true;

        
    }
    };

    $scope.refresh=function(){

        console.log(localStorage.getItem('loggedin'))
        console.log(localStorage.getItem('username'))
        
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getallplacement").then(
        function(response){
        $scope.data=response.data;
        console.log("data")
        console.log($scope.data)
        });

        
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getalllogin").then(
        function(response){
        $scope.data3=response.data;
        console.log($scope.data3);
        });
    
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getallstudent")
        .then(function(response) {
            console.log(response.data);
                $scope.studdata=response.data;
              });
    };

    $scope.numvali=function()
    {
        if($scope.search.score==null)
        {
            $scope.search.score=undefined;
        }

        
      
    }
    $scope.numvali3=function()
    {
        if($scope.searchx.studentid==null)
        {
            $scope.searchx.studentid=undefined;
        }

        
      
    }

    $scope.numvalix=function()
    {
        if($scope.search2.id==null)
        {
            $scope.search2.id=undefined;
        }
        
        if($scope.search2.phone==null)
        {
            $scope.search2.phone=undefined;
        }
    }


    $scope.numvali2=function()
    {
        if($scope.search.toll==null)
        {
            $scope.search.toll=undefined;
        }
    }
    

    $scope.initiateDelete=function(sId){
        $scope.currentDeleteId=sId;
        console.log("initiated delete");
    };

    $scope.terminateDelete=function()
    {
        $scope.currentDeleteId=null;
    };

        $scope.delete=function(sId){
    
            console.log(sId);
            var newUrl="https://tpomanagementsystem.herokuapp.com/tpo/deleteplacement/"+sId.toString();
            console.log(newUrl);
            $http.get(newUrl).then(
                function(response){
                $scope.data=response.data;
                });
            $scope.refresh();
        
            };

            $scope.editinit=function(sId){
    
                console.log(sId);
                var newUrl="https://tpomanagementsystem.herokuapp.com/tpo/getplacement/"+sId.toString();
                console.log(newUrl);
                $http.get(newUrl).then(
                    function(response2){
                        console.log(response2.data[0].id);    
                    $scope.data2=response2.data[0];
                    console.log(response2.data[0]);
                    $scope.id=$scope.data2.id;
                    $scope.name=$scope.data2.name;
                    $scope.profile=$scope.data2.profile;
                    $scope.score=$scope.data2.score;
                    $scope.backlog=$scope.data2.backlog;
                    $scope.date=$scope.data2.date.substr(0,10);
                    $scope.description=$scope.data2.description;

                    $scope.idReadOnly=true;
                    $scope.Submit="Update";
                    
        $scope.modalMessage="Edit Data";

                    });
                    
                    $scope.refresh();
                };

    $scope.editinit2=function(sId){
    
                    console.log(sId);
                    var newUrl="https://tpomanagementsystem.herokuapp.com/tpo/getstudent/"+sId.toString();
                    console.log(newUrl);
                    console.log($scope.stud);
                    $http.get(newUrl).then(
                        function(response2){
                            console.log(response2.data[0].id);    
                        $scope.data2=response2.data[0];
                        $scope.name=$scope.data2.id;
                        $scope.name2=$scope.data2.name;
                        $scope.branch=$scope.data2.branch.toString().toUpperCase();
                        $scope.mobile=$scope.data2.phone;
                        $scope.idReadOnly=true;
                        $scope.Submit="Update";
                        console.log($scope.name);
                        console.log($scope.name2);
                        console.log($scope.branch);
                        console.log($scope.mobile);
            $scope.modalMessage="Edit Data";
    
                        });
                        $scope.refresh();
                    };
    

    $scope.submit=function(){
        if($scope.idReadOnly)
        {
            $scope.update();

        }
        else
        {
            $scope.insert();
        }
        $scope.refresh();
    }



    $scope.update=function(){
        
 
        var newUrl="https://tpomanagementsystem.herokuapp.com/tpo/updateplacement/";
        
        newUrl+=$scope.id.toString();
        newUrl+="/"+$scope.name.toString();
        newUrl+="/"+$scope.profile.toString();
        newUrl+="/"+$scope.score.toString();
        newUrl+="/0";
        newUrl+="/"+$scope.date.toString();
        newUrl+="/ttt";
        newUrl+="/"+$scope.description.toString();
        
        console.log(newUrl);



        $http.get(newUrl).then(
            function(response){
            $scope.data=response.data;
            $scope.idReadOnly=false;
            $scope.Submit="Submit"
            
        $scope.modalMessage="Update Data";
            $scope.reset();
            });

        $scope.refresh();
    }


    $scope.update2=function(){
        
 
        var newUrl2="https://tpomanagementsystem.herokuapp.com/tpo/updatestudent";
        newUrl2+="/"+$scope.name.toString();
        newUrl2+="/"+$scope.name2.toString();
        newUrl2+="/"+$scope.branch.toString();
        
        newUrl2+="/0/0/BE/"+$scope.mobile.toString();
        newUrl2+="/xyz@gmail.com";

        $http.get(newUrl2).then(
            function(response){
            $scope.studdata=response.data;
            $scope.idReadOnly=false;
            $scope.Submit="Submit"
            
        $scope.modalMessage="Update Data";
            $scope.reset();
            });

        $scope.refresh();
    }

    $scope.del=function(){
        localStorage.removeItem("username");
        localStorage.removeItem("loggedin");
        localStorage.removeItem("type");
        $location.path("/");
    }
    $scope.insert=function(){
        var newUrl="https://tpomanagementsystem.herokuapp.com/tpo/insertplacement/";
        
        newUrl+=$scope.id.toString();
        newUrl+="/"+$scope.name.toString();
        newUrl+="/"+$scope.profile.toString();
        newUrl+="/"+$scope.score.toString();
        newUrl+="/0";
        newUrl+="/"+$scope.date.toString();
        newUrl+="/ttt";
        newUrl+="/"+$scope.description.toString();
        
        console.log(newUrl);



        $http.get(newUrl).then(
            function(response){
            $scope.data=response.data;
            $scope.idReadOnly=false;
            $scope.Submit="Submit"
            
        $scope.modalMessage="Insert Data";
            $scope.reset();
            });

        $scope.refresh();
    }


    $scope.submitregister=function()
    {
        
        var newUrl="https://tpomanagementsystem.herokuapp.com/tpo/insertlogin/";
        
        newUrl+=$scope.name.toString();
        newUrl+="/"+$scope.cpass.toString();
        var choi;
        if($scope.loginchoice=='admin')
        {
            choi=0;
        }
        else
        {
            choi=1;
        }
        newUrl+="/"+choi.toString();
        console.log(newUrl);


        $http.get(newUrl);
        if(choi==1)
        {

        var newUrl2="https://tpomanagementsystem.herokuapp.com/tpo/insertstudent";
        newUrl2+="/"+$scope.name.toString();
        newUrl2+="/"+$scope.name2.toString();
        newUrl2+="/"+$scope.branch.toString();
        
        newUrl2+="/0/0/BE/"+$scope.mobile.toString();
        newUrl2+="/xyz@gmail.com";

        $http.get(newUrl2)
        .then(function(response) {
            console.log(response.data);
                $scope.studdata=response.data;
              });
        $scope.refresh();
            }

        $scope.refresh();
    }

   
    $scope.refresh();
//$interval($scope.refresh,1000);



});


app.controller('userControl',function($scope,$location,user,$http,$interval){


    
    $scope.reset=function(){
        $scope.Submit="Submit";
        $scope.idReadOnly=false;
        $scope.id=null;
        $scope.name=null;
        $scope.mobile=null;
        $scope.license=null;
        $scope.toll=null;
        $scope.type=null;
        $scope.disableSubmit=false;
        $scope.usedId=false;
        $scope.modalMessage="Insert Data";
        $scope.currentDeleteId=null;
        $scope.usedName=false;
        $scope.usedlicense=false;
        $scope.loggedinas=user.getname();
        $scope.loggedinas=localStorage.getItem('username');
        $scope.invaliddelete=false;
        $scope.currentDeleteToll=null;
        $scope.invalidtoll=false;
        $scope.invaliddelete=false;
        $scope.type=null;
    }

   
    $scope.reset();
   $scope.validateName=function(){
        


        if(!$scope.idReadOnly)
        {
        console.log("key pressed");
        var flag=0;
        for(var i=0;i<$scope.data3.length;i++)
        {
            if($scope.name==$scope.data3[i].uname)
            flag=1;
        }


        if(flag==1)
        {
            $scope.disableSubmit=true;
            $scope.usedName=true;
            console.log("submit disabled");
        }
        else
        {
            $scope.disableSubmit=false;
            $scope.usedName=false;
            console.log("submit enabled");
        }
    }
    };

    $scope.validateName2=function(){
        


        if(!$scope.idReadOnly)
        {
        console.log("key pressed");
        var flag=0;
        for(var i=0;i<$scope.data3.length;i++)
        {
            if($scope.name==$scope.data3[i].uname && $scope.data3[i].type==1)
            flag=1;
        }


        if(flag==1)
        {
            $scope.disableSubmit=false;
            $scope.usedName=false;
            console.log("submit enabled");
        }
        else
        {
            $scope.disableSubmit=true;
            $scope.usedName=true;
            console.log("submit disabled");
        }
    }
    };


  
    $scope.refresh=function(){

        console.log(localStorage.getItem('loggedin'))
        console.log(localStorage.getItem('username'))
        
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getupcommingplacement").then(
        function(response){
        $scope.data=response.data;
        console.log("data")
        console.log($scope.data)
        });


  
    };
    $scope.numvalixr=function()
    {
        if($scope.searchx.driveid==null)
        {
            $scope.searchx.driveid=undefined;
        }

    }
    $scope.reg=function(ecode)
    {
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getregs/"+ecode.toString()+"/"+$scope.loggedinas.toString()).then(
            function(response){
                console.log(response)
            if(response.data.length==0)
            {
                console.log("https://tpomanagementsystem.herokuapp.com/tpo/insertreg/"+ecode.toString()+"/"+$scope.loggedinas.toString());
                $http.get("https://tpomanagementsystem.herokuapp.com/tpo/insertreg/"+ecode.toString()+"/"+$scope.loggedinas.toString()).then(
            function(response2){
                console.log(response2)
            });

            }

            });
    }

    $scope.fetchd=function()
    {
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getrek/"+$scope.loggedinas.toString()).then(
            function(response2){
                $scope.fetchdata=response2.data;
                $scope.count=$scope.fetchdata.length;
            });
    }

    $scope.delreg=function(ecode)
    {
        $http.get("https://tpomanagementsystem.herokuapp.com/tpo/deletereg/"+ecode.toString()+"/"+$scope.loggedinas.toString()).then(
            function(response){
                $http.get("https://tpomanagementsystem.herokuapp.com/tpo/getrek/"+$scope.loggedinas.toString()).then(
                    function(response2){
                        $scope.fetchdata=response2.data;
                        $scope.count=$scope.fetchdata.length;
                    });
            });
    }

    
    $scope.del=function(){
        localStorage.removeItem("username");
        localStorage.removeItem("loggedin");
        // localStorage.setItem("loggedin",false);
        // localStorage.setItem("username","&&invalid&&");
        // localStorage.removeItem("type");
        
        $location.path("/");
    }
        $scope.refresh();
//$interval($scope.refresh,1000);



});

