
(function(){
    'use strict'
    app.controller('BaselArticle', [ '$scope', 'staticArticle.repository', '$location', '$rootScope','notify',function($scope, staticArticleRepository, $location, $rootScope, notify){
        $scope.newComment = {
            "article_id": 1,
            "user_id": 0,
            "rate": 0,
            "content": "",
            "static": true
        }
        $scope.editObj = {
            rate: '',
            content: ''
        }
        $scope.path = $rootScope.path;
        $scope.autoraisMod = false;
        if(localStorage.getItem('authToken')){
            $scope.autoraisMod = true;
        };

        // SERVICE FUNCTION

        function accesforUser(data, id, flag, mod){
            for (let i = 0; i < data.length; i++) {
                if(data[i].user.id === id){
                    data[i][mod] = flag;
                }
                for (let j = 0; j < data[i].nested.length; j++) {
                    if(data[i].nested[j].user.id === id){
                        data[i].nested[j][mod] = flag;
                    };
                    for (let x = 0; x < data[i].nested[j].nested.length; x++){
                        if(data[i].nested[j].nested[x].user.id === id){
                            data[i].nested[j].nested[x][mod] = flag;
                        };
                    }  
                }
                
            }
            
            return data
        }
        function editMod(data, id, flag, mod){
            for (let i = 0; i < data.length; i++) {
                if(data[i].id === id){
                    data[i][mod] = flag;
                }
                for (let j = 0; j < data[i].nested.length; j++) {
                    if(data[i].nested[j].id === id){
                        data[i].nested[j][mod] = flag;
                    };
                    for (let x = 0; x < data[i].nested[j].nested.length; x++){
                        if(data[i].nested[j].nested[x].id === id){
                            data[i].nested[j].nested[x][mod] = flag;
                        };
                    }   
                }
                
            }
            
            return data
        }
        function showComment(data, flag, mod){
            for (let i = 0; i < data.length; i++) {
                data[i][mod] = flag;
                for (let j = 0; j < data[i].nested.length; j++) {
                    data[i].nested[j][mod] = flag;
                    for (let x = 0; x < data[i].nested[j].nested.length; x++){
                        data[i].nested[j].nested[x][mod] = flag;
                    }   
                }
                
            }
            
            return data
        }
        function showCommentForId(data, id, flag, mod){
            for (let i = 0; i < data.length; i++) {
                if(data[i].id === id){
                    data[i][mod] = flag;
                    for (let j = 0; j < data[i].nested.length; j++) {
                        data[i].nested[j][mod] = flag;
                        for (let x = 0; x < data[i].nested[j].nested.length; x++){
                            data[i].nested[j].nested[x][mod] = flag;
                        }   
                    }
                }else if(data[i].id !== id){
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < data[i].nested.length; j++) {
                            if(data[i].id === id){
                            data[i].nested[j][mod] = flag;
                            }
                            for (let x = 0; x < data[i].nested[j].nested.length; x++){
                                data[i].nested[j].nested[x][mod] = flag;
                            }   
                        }
                    
                    }
                }
                }
                return data  
            }
            


        function debugCommentMod(data){
            
            for (let i = 0; i < data.length; i++) {
                data[i].commentMod = false;
                for (let j = 0; j < data[i].nested.length; j++) {
                    data[i].nested[j].commentMod = false;
                    for (let x = 0; x < data[i].nested[j].length; x++){
                            data[i].nested[j].nested[x].commentMod = false;
                    }    
                }
            }
            return data
        };
        function commentMod(data, id, flag){
            data.map(function(item){
                if(item.id === id){
                    item.commentMod = flag;
                }
                for (let x = 0; x < item.nested.length; x++){
                    item.nested[x].commentMod = flag;
                    for (let j = 0; j < item.nested[x].length; j++){
                        item.nested[x].nested[j].commentMod = flag;
                    }
                }   
            })
        }
        function getComment(){
            staticArticleRepository.getCommentsStaticArticles().then(function(response){
                console.log(response.data)
                let commentMod = debugCommentMod(response.data);
                let userId = +localStorage.getItem('userId');
                let access = accesforUser(commentMod, userId, true, 'access');
                let comments = showComment(access, false, 'showComment');
                console.log(comments)
                $scope.comments = comments.slice().reverse();
            }) 
        }

        
        function addComment(parentId){
            let userId = localStorage.getItem('userId');
            $scope.newComment.user_id = userId;
            $scope.newComment.parent_id = parentId;
            staticArticleRepository.addCommentStaticArticle($scope.newComment)
            .then(function(response){
                getComment();
                notify({
                    message: 'Комментарий добавлен',
                    classes: 'alert danger',
                })
                $scope.newComment = {
                    "article_id": 1,
                    "user_id": 0,
                    "rate": 0,
                    "content": "",
                    "static": true
                }
            })
        }

        // MAIN

        staticArticleRepository.getStaticArticles($scope.path).then(function(response){
            $scope.articles = response.data;
            console.log($scope.articles);
            staticArticleRepository.getCommentsStaticArticles().then(function(response){
                getComment()
                console.log($scope.comments);
            }) 
        })
        
        // ADD & DELETE

        $scope.addComment = function(){
            addComment(0)
        }
        $scope.deleteComment = function(id){
            staticArticleRepository.deleteCommentStaticArticle(id)
            .then(function(response){
                getComment();
                notify({
                    message: 'Комментарий удален',
                    classes: 'alert-danger',
                })
            })
        }
        // COMMENT COMMENT


        $scope.cancelCommentComment = function(id){
            commentMod($scope.comments, id, false)
        }
        $scope.addCommentComment = function(id){
            commentMod($scope.comments, id, false)
            addComment(id);
            notify({
                message: 'Комментарий добавлен',
                classes: 'alert-danger',
            })
        }
        $scope.commentComment = function(id){
            commentMod($scope.comments, id, true)    
        }
        // EDIT

        $scope.editComment = function(id, content){
            $scope.editObj.content = content;
            var comments = editMod($scope.comments , id, true, 'editMod');
            $scope.comments = comments;
        };
        $scope.cancelEditComment = function(id){
            $scope.editObj.content = '';
            var comments = editMod($scope.comments , id, false, 'editMod');
            $scope.comments = comments;
        };
        $scope.addEditComment = function(id, rate){
            $scope.editObj.rate = rate
            console.log(id)
            staticArticleRepository.editCommentStaticArticle(id, $scope.editObj).then(function(response){ 
                console.log(response)
                getComment()
                notify({
                    message: 'Комментарий отредактировано',
                    classes: 'alert-danger',
                })
                $scope.editObj = {
                    rate: '',
                    content: ''
                }
            })
        };
        $scope.showComment = function(id){
            $scope.comments = showCommentForId($scope.comments, id, true , 'showComment');
        }
        $scope.hidenComment = function(id){
            $scope.comments = showCommentForId($scope.comments, id, false , 'showComment'); 
        }  
     }])
})()