function startChange(value){
    var str = "place-L-" + String(String(value).substring(6));
    var cbs = document.getElementsByName("place");
    var location_logo = document.getElementsByClassName("iconfont icon-location2");
    for(var cb=0;cb<cbs.length;cb++){
        cbs[cb].disabled = "";
        location_logo[cb].style.color= "";
        location_logo[cb].style.display= "";
    }
    if(document.getElementById('endPlace').value!=0){
        document.getElementById(document.getElementById('endPlace').value).checked = false;
        document.getElementById(document.getElementById('endPlace').value).disabled = "true";
        location_logo[document.getElementById('endPlace').value.substring(6)-1].style.display="block";
        location_logo[document.getElementById('endPlace').value.substring(6)-1].style.color="purple";
    }
    if(document.getElementById('startPlace').value!=0){
        document.getElementById(document.getElementById('startPlace').value).checked = false;
        document.getElementById(document.getElementById('startPlace').value).disabled = "true";
        location_logo[document.getElementById('startPlace').value.substring(6)-1].style.display="block";
        location_logo[document.getElementById('startPlace').value.substring(6)-1].style.color="purple";
    }
}


function consultWindow(){
    var name;
    name=prompt("温馨提示：请问你想谁为你做人工咨询，我们有吴彦祖，余文乐，范冰冰，古天乐，黄嘉琳?输入你想要的名字，有惊喜哦。");
    alert("你脑子进水了吧，怎么有可能。你想"+name+"想多了吧。我们只有垃圾黄嘉琳。不要就算。");
}

