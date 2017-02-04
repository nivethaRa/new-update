$.init = function(source, maxQtTags){
    setTagSource(source);
    if(maxQtTags != undefined && maxQtTags > 0){
        setMaxQtTags(maxQtTags);   
    }
    $.tagTable.height = 0; 
}

$.setInitialTags = function(initialTags){
    for (var i = 0; i < initialTags.length; i++) {
        if(tagSource.indexOf(initialTags[i]) >=0){
            tagSource.splice(initialTags[i],1);
        }
        createNewTag(initialTags[i])
    };
}

$.setMaxQtTags = setMaxQtTags = function(maxQtTags){
    maxTags = maxQtTags;
}

$.getSelectedTags = function(){
    return tagsArray;   
}

var setTagSource = function(source){
    tagSource = [];
    tagSource = tagSource.concat(source);
    tagSource = tagSource.sort();
}

var tagSource;
var maxTags = 0;

var tagsArray = [];

var createNewTag = function(tag){
    if(maxTags != undefined && (maxTags == 0 || maxTags >= tagsArray.length)){
        if(tagsArray.indexOf(tag) == -1){
            tagSource.splice(tagSource.indexOf(tag), 1); 
            tagsArray.push(tag);
            createTagView(tag);
        }
    }
}

var createTagView = function(tagText){
    var tagContainer = $.UI.create('View', {
        classes: ["tagContainer"],
        layout: "horizontal",
        tagText: tagText,
    });
    var tagRemover = $.UI.create('ImageView', {
        classes: ["tagRemover"],
    });
    tagContainer.addEventListener('click', function(e) {
        if(e.source.tagText != undefined && e.source.tagText != ""){
            removeFromTagList(e.source.tagText);
        }
    });
    var tagText = $.UI.create('Label', {
        classes: ["tagText"],
        text: tagText,
    });
    tagContainer.add(tagText);
    tagContainer.add(tagRemover);

    $.tagArea.add(tagContainer);
}

var removeFromTagList = function(tagText){
    tagsArray.splice(tagsArray.indexOf(tagText), 1); 
    tagSource.push(tagText);
    tagSource.sort();
    for (var i = 0; i < $.tagArea.children.length; i++) {
        if($.tagArea.children[i].tagText == tagText){
            $.tagArea.remove($.tagArea.children[i]);
        }
    };
}

$.tagSearch.addEventListener('change', function(e){
    CreateAutoCompleteList(PatternMatch(e.source.value));
});

$.tagTable.addEventListener('click', function(e){
    if(e.rowData.result != undefined && e.rowData.result != ""){
        createNewTag(e.rowData.result);
        CreateAutoCompleteList(PatternMatch($.tagSearch.value));
    }
});

var PatternMatch = function(pattern){
    if(pattern == ""){
        return [];
    }
    var searchLen = pattern.length;
    var tempArray = [];    
    for(var index = 0, len = tagSource.length; index< len; index++){
        if(tagSource[index].substring(0,searchLen).toUpperCase() === pattern.toUpperCase()){
            tempArray.push(tagSource[index]);
        }
    }
    return tempArray;
}

function CreateAutoCompleteList(searchResults){
    var tableData = [];
    for(var index=0, len = searchResults.length; index < len; index++){

            var lblSearchResult = $.UI.create("Label",{
                classes : ["labelAutoComplete"],
                text : searchResults[index]
            });

            var imageCheck = $.UI.create("ImageView",{
                classes : ["imageCheck"],
            });

            var row = $.UI.create("TableViewRow", {
               classes : ["tableViewRow"],
               result : searchResults[index]
            });

            row.add(lblSearchResult);
            row.add(imageCheck);
            tableData.push(row);
    }
    if(tableData.length == 0){
        $.tagTable.height = 0;
    }else if(tableData.length < 3){
        $.tagTable.height = 36 * tableData.length;
    }else{
        $.tagTable.height = 108;
    }
    $.tagTable.setData(tableData);
}