const functions = require("firebase-functions/v2");
let admin = require("firebase-admin");
const cors = require("cors")({origin:true});
let axios = require("axios");
let FormData = require("form-data");

let serviceAccount = require("./testdatabase-50-firebase-adminsdk-hvx2e-cbfcf68b4c.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testdatabase-50-default-rtdb.firebaseio.com"
});

let db = admin.database();


exports.helloWorld = functions.https.onRequest((request, response) => {
  // db.ref("testtest").set("functions이용해서 database에 값넣기");
  cors(request, response, ()=> {
    db.ref("msgs").on("value", (snapshot)=>{  //값가져오기
      response.send(snapshot.val()); //snapshot.val은 , msgs에 있는값이 전달된다는거임
      // response.send('여기에 있는 값=결과값'); 여기있는 결과값이 프론트단에서 .done(function(json){});여기의 json임
    });
  })
});

exports.ceocamp = functions.https.onRequest((request, response) => {
  let byul = {
    name: "이한별",
    age: 33,
    height: 176
  }

  response.send(byul);

});

exports.login = functions.https.onRequest((request, response) => {
  cors(request, response, ()=> {

    if(!request.body.id){
      response.send({"result":"정상적인 접근이 아닙니다"});

    }

    let id = request.body.id; //프론트에서 ajax data: {id:idvalue, pwd:pwdvalue}이렇게 전송한걸 여기서 이렇게 받아온거임
    let pwd = request.body.pwd;

    db.ref("members/"+id).on("value",(snapshot)=>{ //멤버스의 id를 키로 가진게 있는지 찾아보고
      if(snapshot.val()){  //값이 있으면 이게 트루가돼서
        if(snapshot.val() == pwd){
          response.send({"result_code":1,"result":"로그인 되었습니다."});
        }else{
          response.send({"result_code":2,"result":"비밀번호가 일치하지 않습니다."});
        }
      }else{
        response.send({"result_code":3,"result":"가입되지 않은 회원입니다."});
      }
    });
  });
});




exports.join = functions.https.onRequest((request, response) => {
  cors(request, response, ()=> {
    let id = request.body.id;
    let pwd = request.body.pwd;
    db.ref("members/"+id).set(pwd); //넣기
  });
  response.send(JSON.stringify('ok'));
});

exports.sendSMS = functions.https.onRequest((request, response)=> {
  cors(request, response, ()=>{

    let phone = request.body.phone;

    let data = new FormData();
    data.append("remote_id", "hbyulee");
    data.append("remote_pass", "패스워드");
    data.append("remote_num", "1");
    data.append("remote_phone", phone);
    data.append("remote_callback", "01091815245");
    data.append("remote_msg", "안녕하세요.");

   axios({
     method:"post",
     url: "https://www.munja123.com/Remote/RemoteSms.html",
     headers:{
       ...data.getHeaders()
     },
     data: data
   }).then((res)=>{
     response.send({"result_code":"1", "result":"전송 완료"});
   })
   })
  });



//여기는 외부에서 볼수없는 폴더들
