
/**
 * 迪杰斯特拉算法
 */

const MAXVEX = 48;

// 顶点
function Vertex(name) {
    this.name = name;
}

// 邻接矩阵
function arc(maxvex) {
    this.maxvex = maxvex;
    this.arcnum = 0;
    this.data = new Array(maxvex);
    for (var i = 0; i < this.data.length; i++) {
        this.data[i] = new Array(maxvex);
        for (var j = 0; j < this.data[i].length; j++) {
            this.data[i][j] = Infinity;
            if (i == j)
                this.data[i][j] = 0;
        }
    }
}

// 图
function Mgraph(maxvex, vertexs) {
    this.arc = new arc(maxvex);
    this.vertexs = vertexs;
}

// 添加边
Mgraph.prototype.addArc = function (start, end, length) {
    var i = this.vertexs.indexOf(start);
    var j = this.vertexs.indexOf(end);
    this.arc.data[i][j] = length;
    this.arc.data[j][i] = length;
    this.arc.arcnum++;
}

// 迪杰斯特拉算法
Mgraph.prototype.shortPath_Dijkstra = function (v0, v1, pathArray) {
    var v0_index = this.vertexs.indexOf(v0);
    var v1_index = this.vertexs.indexOf(v1);
    var final = [];     // 表示当前是否计算出了结果
    var pathmatrix = [];    // 最短路径下标数组
    var shortpathtable = [];    // 存储到各点的最短路径权值和
    var pathArrayTemp = [];     // 暂存路径顺序
    console.info('开始初始化：准备计算'+v0.name+'到各点最短路径');
    for (var i = 0; i < this.arc.maxvex; i++) {
        final.push(0);
        shortpathtable.push(this.arc.data[v0_index][i]);
        pathmatrix.push(v0_index);
    }
    shortpathtable[v0_index] = 0;
    final[v0_index] = 1;
    console.info('初始化完毕：final：'+final);
    console.info('初始化完毕：pathmatrix：'+pathmatrix);
    console.info('初始化完毕：shortpathtable：'+shortpathtable);
    var min, k;
    var segment, location;
    location = v1_index;
    for (var i = 0; i < this.arc.maxvex; i++) {
        if (i == v0_index)
            continue;
        min = Infinity;
        for (var w = 0; w < this.arc.maxvex; w++) {
            // 测试
            if (!final[w] && shortpathtable[w] < Infinity) {
                console.info('发现点：' + this.vertexs[w].name + '到' + v0.name + '的最短路径是' + shortpathtable[w]);
            }
            if (!final[w] && shortpathtable[w] < min) {
                k = w;
                min = shortpathtable[w];
            }
        }
        console.info('没错，' + this.vertexs[k].name + '是最接近当前' + v0.name + '的');
        final[k] = 1;
        console.info('已经完成对点：' + this.vertexs[k].name + '最短路径计算');
        for (var w = 0; w < this.arc.maxvex; w++) {
            if (!final[w] && (min + this.arc.data[k][w] < shortpathtable[w])) {
                console.info('因为' + this.vertexs[k].name + '的参与，发现点：' + this.vertexs[w].name + '到' + v0.name + '最短路径是' + (min + this.arc.data[k][w]));
                shortpathtable[w] = min + this.arc.data[k][w];
                pathmatrix[w] = k;
            }
        }
    }
    while (location != v0_index) {
        segment = this.vertexs[pathmatrix[location]].name + '->' + this.vertexs[location].name;
        pathArrayTemp.push(segment);
        location = pathmatrix[location];
    }
    pathArrayTemp.reverse();
    pathArray.push.apply(pathArray, pathArrayTemp);
    console.info(final);
    console.info(pathmatrix);
    console.info(shortpathtable);
    console.info(pathArray);
    return shortpathtable[v1_index];
}

// 全排列
function fullArray(arr) {
    if (arr.length == 1)
        return arr;
    else if (arr.length == 2)
        return [[arr[0], arr[1]], [arr[1], arr[0]]];
    else {
        var temp = [];
        for (var i = 0; i < arr.length; i++) {
            var save = arr[i];
            arr.splice(i, 1);       // 删除arr[i]
            var res = fullArray(arr);       // 递归求出n-1的全排列
            arr.splice(i, 0, save);     // 恢复arr[i]
            for (var j = 0; j < res.length; j++) {      // 分别将arr[i]加入到各个排列中并将结果加入到temp中
                res[j].push(arr[i]);
                temp.push(res[j]);
            }
        }
        return temp;
    }
}

// 中间点的最短路径
Mgraph.prototype.pathMideNode = function (mgraph, mid, pathArray) {
    var dist = 0;       // 最短距离
    var temp = 0;       // 相邻点的最短距离
    for (var i = 0; i < mid.length-1; i++) {
        // if (this.arc.data[mid[i].name][mid[i+1].name] != Infinity) {
        //     temp = this.arc.data[mid[i].name][mid[i + 1].name];
        //     pathArray.push(mid[i].name+'->'+mid[i+1].name);
        // }else
        temp = mgraph.shortPath_Dijkstra(mid[i], mid[i+1], pathArray);
        dist += temp;
    }
    return dist;
}

// 访问顶点
Mgraph.prototype.dsf_visit = function (mgraph, marked, u) {
    var v;
    marked[u.name] = 1;      // 标记为已访问
    for (v in this.vertexs) {
        if (this.arc.data[u.name][this.vertexs[v].name] != 0 && this.arc.data[u.name][this.vertexs[v].name] != Infinity && marked[this.vertexs[v].name] != 1)
            mgraph.dsf_visit(mgraph, marked, this.vertexs[v]);       // 访问u的下一个未访问邻接顶点
    }
}

// 深度优先搜索，判断中间点是否连通
Mgraph.prototype.isConnected = function (mgraph, mid) {
    var u;
    var marked = [];        // 标志数组
    var count = 0;  // 计数器
    if (mid.length != 0)
        u = mid[0];
    else
        return true;
    for (var i = 0; i < this.arc.maxvex; i++)       // 初始化标志数组
        marked.push(0);
    if (marked[u.name] != 1)
        mgraph.dsf_visit(mgraph, marked, u);
    for (var i = 0; i < marked.length; i++) {
        for (var j = 0; j < mid.length; j++)
            if (i == mid[j].name && marked[i] == 1)
                count++;
    }
    if (count == mid.length)
        return true;
    else
        return false;
}

// 经过n个中间点的最短路径
function shortPath(mgraph, start, mid, end,  pathArray) {
    if (!mgraph.isConnected(mgraph, mid))
        return -1;
    var path = Infinity;        // 全程最短距离
    var midPath;        // 中间点最短距离
    var temp;       // 备选最短距离
    var startPathArray = [];    // 起点到V0的最短路径
    var midPathArray = [];      // 中间点最短路径
    var endPathArray = [];      // Vn到终点的最短路径
    var startPathArrayTemp = [];
    var midPathArrayTemp = [];
    var endPathArrayTemp = [];
    var full = fullArray(mid);      // 中间点全排列
    if (mid.length == 0)        // 若中间点集为空，则直接求Dijkstra最短路径
        return mgraph.shortPath_Dijkstra(start, end, pathArray);
    for (var i = 0; i < full.length; i++) {
        midPath = mgraph.pathMideNode(mgraph, full[0], midPathArrayTemp);
        if (full.length == 1)       // 若中间点只有一个，则full为只有一个元素的一维数组；有多个时为二维数组
            temp = mgraph.shortPath_Dijkstra(start, full[0], startPathArrayTemp) + midPath + mgraph.shortPath_Dijkstra(full[0], end, endPathArrayTemp);
        else
            temp = mgraph.shortPath_Dijkstra(start, full[0][0], startPathArrayTemp) + midPath + mgraph.shortPath_Dijkstra(full[0][full[0].length-1], end, endPathArrayTemp);
        if (temp < path) {
            path = temp;
            startPathArray = startPathArrayTemp;
            midPathArray = midPathArrayTemp;
            endPathArray = endPathArrayTemp;
        }
        startPathArrayTemp = [];
        midPathArrayTemp = [];
        endPathArrayTemp = [];
        full.splice(0, 1);      // 删除当前排列
    }
    pathArray.push.apply(pathArray, startPathArray);
    pathArray.push.apply(pathArray, midPathArray);
    pathArray.push.apply(pathArray, endPathArray);
    console.info(pathArray);
    return path;
}

var vertexs = [];
for (var i = 0; i < MAXVEX; i++) {
    var v = new Vertex(i);
    vertexs.push(v);
}
var mgraph = new Mgraph(vertexs.length, vertexs);
mgraph.addArc(vertexs[0], vertexs[1], 85);
mgraph.addArc(vertexs[0], vertexs[2], 213);
mgraph.addArc(vertexs[0], vertexs[40], 796);
mgraph.addArc(vertexs[2], vertexs[3], 83);
mgraph.addArc(vertexs[2], vertexs[4], 250);
mgraph.addArc(vertexs[3], vertexs[15], 200);
mgraph.addArc(vertexs[3], vertexs[16], 157);
mgraph.addArc(vertexs[3], vertexs[14], 285);
mgraph.addArc(vertexs[4], vertexs[5], 93);
mgraph.addArc(vertexs[4], vertexs[14], 250);
mgraph.addArc(vertexs[5], vertexs[6], 46);
mgraph.addArc(vertexs[5], vertexs[7], 74);
mgraph.addArc(vertexs[5], vertexs[14], 270);
mgraph.addArc(vertexs[6], vertexs[8], 170);
mgraph.addArc(vertexs[7], vertexs[9], 140);
mgraph.addArc(vertexs[7], vertexs[14], 120);
mgraph.addArc(vertexs[8], vertexs[9], 62);
mgraph.addArc(vertexs[9], vertexs[10], 100);
mgraph.addArc(vertexs[10], vertexs[12], 74);
mgraph.addArc(vertexs[11], vertexs[12], 82);
mgraph.addArc(vertexs[11], vertexs[16], 180);
mgraph.addArc(vertexs[11], vertexs[14], 170);
mgraph.addArc(vertexs[11], vertexs[13], 270);
mgraph.addArc(vertexs[13], vertexs[21], 140);
mgraph.addArc(vertexs[13], vertexs[22], 160);
mgraph.addArc(vertexs[13], vertexs[18], 130);
mgraph.addArc(vertexs[14], vertexs[16], 130);
mgraph.addArc(vertexs[15], vertexs[16], 190);
mgraph.addArc(vertexs[15], vertexs[41], 120);
mgraph.addArc(vertexs[15], vertexs[42], 64);
mgraph.addArc(vertexs[16], vertexs[17], 110);
mgraph.addArc(vertexs[16], vertexs[19], 200);
mgraph.addArc(vertexs[16], vertexs[41], 170);
mgraph.addArc(vertexs[17], vertexs[11], 94);
mgraph.addArc(vertexs[17], vertexs[18], 78);
mgraph.addArc(vertexs[17], vertexs[19], 63);
mgraph.addArc(vertexs[18], vertexs[20], 194);
mgraph.addArc(vertexs[18], vertexs[11], 273);
mgraph.addArc(vertexs[19], vertexs[46], 76);
mgraph.addArc(vertexs[19], vertexs[20], 261);
mgraph.addArc(vertexs[19], vertexs[47], 280);
mgraph.addArc(vertexs[20], vertexs[22], 53);
mgraph.addArc(vertexs[20], vertexs[23], 97);
mgraph.addArc(vertexs[20], vertexs[47], 107);
mgraph.addArc(vertexs[21], vertexs[26], 40);
mgraph.addArc(vertexs[21], vertexs[30], 450);
mgraph.addArc(vertexs[21], vertexs[23], 40);
mgraph.addArc(vertexs[22], vertexs[23], 110);
mgraph.addArc(vertexs[23], vertexs[24], 56);
mgraph.addArc(vertexs[23], vertexs[26], 40);
mgraph.addArc(vertexs[24], vertexs[29], 180);
mgraph.addArc(vertexs[24], vertexs[25], 15);
mgraph.addArc(vertexs[24], vertexs[27], 15);
mgraph.addArc(vertexs[25], vertexs[46], 344);
mgraph.addArc(vertexs[25], vertexs[36], 200);
mgraph.addArc(vertexs[26], vertexs[30], 400);
mgraph.addArc(vertexs[27], vertexs[28], 60);
mgraph.addArc(vertexs[27], vertexs[29], 50);
mgraph.addArc(vertexs[27], vertexs[23], 184);
mgraph.addArc(vertexs[28], vertexs[29], 30);
mgraph.addArc(vertexs[28], vertexs[34], 421);
mgraph.addArc(vertexs[28], vertexs[31], 100);
mgraph.addArc(vertexs[28], vertexs[30], 200);
mgraph.addArc(vertexs[29], vertexs[36], 242);
mgraph.addArc(vertexs[30], vertexs[32], 182);
mgraph.addArc(vertexs[32], vertexs[33], 50);
mgraph.addArc(vertexs[34], vertexs[33], 163);
mgraph.addArc(vertexs[35], vertexs[37], 42);
mgraph.addArc(vertexs[36], vertexs[38], 117);
mgraph.addArc(vertexs[38], vertexs[41], 277);
mgraph.addArc(vertexs[38], vertexs[47], 642);
mgraph.addArc(vertexs[39], vertexs[44], 412);
mgraph.addArc(vertexs[39], vertexs[40], 244);
mgraph.addArc(vertexs[41], vertexs[47], 431);
mgraph.addArc(vertexs[41], vertexs[46], 224);
mgraph.addArc(vertexs[41], vertexs[42], 80);
mgraph.addArc(vertexs[42], vertexs[45], 47);
mgraph.addArc(vertexs[43], vertexs[44], 32);
mgraph.addArc(vertexs[43], vertexs[45], 242);
mgraph.addArc(vertexs[46], vertexs[47], 287);
mgraph.addArc(vertexs[24], vertexs[47], 74);
mgraph.addArc(vertexs[16], vertexs[42], 213);
mgraph.addArc(vertexs[34], vertexs[36], 47);
mgraph.addArc(vertexs[35], vertexs[36], 22);


var allPathNameStr = [
            "from-42-to-47",
            "from-20-to-47",
            "from-20-to-21",
            "from-17-to-20",
            "from-17-to-42",
            "from-17-to-18",
            "from-18-to-19",
            "from-12-to-17",
            "from-14-to-19",
            "from-21-to-23",
            "from-21-to-24",
            "from-47-to-48",
            "from-26-to-47",
            "from-26-to-37",
            "from-25-to-26",
            "from-25-to-48",
            "from-24-to-25",
            "from-25-to-30",
            "from-25-to-28",
            "from-23-to-24",
            "from-14-to-23",
            "from-12-to-14",
            "from-14-to-22",
            "from-33-to-34",
            "from-1-to-41",
            "from-1-to-2",
            "from-1-to-3",
            "from-3-to-4",
            "from-4-to-16",
            "from-16-to-42",
            "from-16-to-43",
            "from-42-to-43",
            "from-17-to-43",
            "from-16-to-17",
            "from-17-to-42",
            "from-3-to-5",
            "from-15-to-17",
            "from-12-to-15",
            "from-4-to-17",
            "from-5-to-15",
            "from-5-to-6",
            "from-6-to-8",
            "from-6-to-7",
            "from-12-to-13",
            "from-11-to-13",
            "from-10-to-11",
            "from-8-to-10",
            "from-8-to-15",
            "from-9-to-10",
            "from-7-to-9",
            "from-33-to-34",
            "from-31-to-33",
            "from-29-to-31",
            "from-29-to-32",
            "from-29-to-30",
            "from-28-to-30",
            "from-28-to-29",
            "from-24-to-28",
            "from-24-to-27",
            "from-29-to-35",
            "from-30-to-37",
            "from-22-to-31",
            "from-27-to-31",
            "from-22-to-27",
            "from-40-to-41",
            "from-40-to-45",
            "from-44-to-45",
            "from-44-to-46",
            "from-43-to-46",
            "from-39-to-42",
            "from-37-to-39",
            "from-35-to-37",
            "from-36-to-37",
            "from-36-to-38",
            "from-38-to-40",
            "from-38-to-41",
            "from-4-to-15",
            "from-6-to-15",
            "from-18-to-20",
            "from-19-to-21",
            "from-12-to-19",
            "from-20-to-48",
            "from-22-to-24",
            "from-35-to-36",
            "from-39-to-48",
            "from-42-to-48",
            "from-21-to-48"];

function startShortPath(){
    if(parseInt(document.getElementById("startPlace").value.replace(/[^0-9]/ig,""))==0||parseInt(document.getElementById("endPlace").value.replace(/[^0-9]/ig,""))==0){
        alert("请选择起点和终点。");
        window.location.reload();
    }
    else{
    for(var i=0;i<allPathNameStr.length;i++){
        document.getElementById(allPathNameStr[i]).style.display = "none";
    }
    var startPointNum =  document.getElementById("startPlace").value.replace(/[^0-9]/ig,"")-1;
    var endPointNum = document.getElementById("endPlace").value.replace(/[^0-9]/ig,"")-1;
    var midPoints = [];
    for(var i=0;i<48;i++){
        var nameStr = "place-"+String(i+1);
        var thisMidPoint = document.getElementById(nameStr);
        if(thisMidPoint.checked){
            midPoints.push(vertexs[thisMidPoint.id.replace(/[^0-9]/ig,"")-1]);
        }
    }
    
    var pathArray = [];
    var path = shortPath(mgraph, vertexs[startPointNum], midPoints, vertexs[endPointNum], pathArray);
    
    var pathNameArray = [];
    var pathNameArrayText = [];
    for(var i=0;i<pathArray.length;i++){
        var pathName1 = parseInt(String(pathArray[i]).substring(0,2).replace(/[^0-9]/ig,""));
        var pathName2 = parseInt(String(pathArray[i]).substring(2).replace(/[^0-9]/ig,""));
        var pathNameText = "\nFrom-"+document.getElementById("startPlace").options[pathName1+1].text+"-to-"+document.getElementById("startPlace").options[pathName2+1].text+"   "+String(mgraph.arc.data[pathName1][pathName2])+"m";
        pathNameArrayText.push(pathNameText);
        if(pathName1>pathName2){
            var temp = pathName1;
            pathName1 = pathName2;
            pathName2 = temp;
            var pathName = "from-"+String(pathName1+1)+"-to-"+String(pathName2+1);
            pathNameArray.push(pathName);
            
        }else{
            var pathName = "from-"+String(pathName1+1)+"-to-"+String(pathName2+1);
            pathNameArray.push(pathName);
        }
    }
    for(var i=0;i<pathNameArray.length;i++){
        document.getElementById(pathNameArray[i]).style.display = 'block';
    }
    var startPlaceName = document.getElementById("startPlace").options[document.getElementById("startPlace").value.replace(/[^0-9]/ig,"")].text;
    var endPlaceName = document.getElementById("endPlace").options[document.getElementById("endPlace").value.replace(/[^0-9]/ig,"")].text;
    document.getElementById("resultArea").textContent = "起点："+startPlaceName+"\n"+pathNameArrayText+".\n\n终点："+endPlaceName+"\n\n总路程："+path+"m";
}
}
