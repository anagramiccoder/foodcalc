import './App.css';
import { Input,Select,Option,Box} from '@mui/joy';
import Typography from '@mui/joy/Typography';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {WHO_BMI,QI,AP,Bray, DBW_tab} from "./data/objects.js";
function App() {
  const [selectedWeight,setSelectedWeight]=useState("kg");
  const [current_weight,setWeight]=useState(0); //in kg
  const [current_height,setHeight]=useState(0); //in m
  //TER constants
  const [HBPA, setHBPA] = useState(1.2);
  const [KRTER, setKRTER] = useState(0);
  const [REE, setREE] = useState(NaN);
  const [Method, setMethod] = useState(0);
  const [finalTER, setfinalTER] = useState(0);
  //TER but for the factorial
  const [TBMR, setTBMR] = useState(0);
  const [PA, setPA] = useState(0);
  const [SDA, setSDA] = useState(0);
  const [TERd, setTERd] = useState(0);
  const [wdTER, setwdTER] = useState(0)

  const [DBW,setDBW]=useState(0);
  const[Age,setAge]=useState({year:0,month:0});
  const [sex,setSex]=useState("M");
  const [isPregnant, setIsPregnant]=useState(0);
  const [isLactating, setIsLactating]=useState(0);
  const [BMI,setBMI]=useState("a");//setting to a non-numerical value

  //for DBW-dependent Updates
  useEffect(
    ()=>{
      let temp_BMR=0;
      const PAF=[10,30,50,75,100][KRTER];
      let temp_PA=0;
      let temp_SDA=0;
      let temp_TER=0;
      if (sex==="F"){
        temp_BMR=0.9*DBW.toFixed(0)*24;
      }else{
        temp_BMR=24*DBW.toFixed(0);
      }
      temp_PA=(PAF/100)*temp_BMR;
      temp_SDA=(temp_PA+temp_BMR)/10;
      temp_TER=temp_BMR+temp_PA+temp_SDA;
      setTBMR(temp_BMR);
      setPA(temp_PA);
      setSDA(temp_SDA);
      setTERd(temp_TER);
      setwdTER(Math.round(temp_TER/50)*50);
      return ()=>{};
    },[DBW,sex,KRTER]
  );


  function changeREE(toval){
    console.log("TOVAL:",current_weight,current_height,Age.Year);
    if(toval==="F"&& (Age.year>0 ||Age.month>0)){
      setREE(655.1+(9.6*current_weight)+(1.9*current_height*100)-(4.7*Age.year));
    }
    else if(toval==="M"&& (Age.year>0 ||Age.month>0)){
      setREE(65.5+(13.8*current_weight)+(5*current_height*100)-(6.8*Age.year));
    }
  }
  function updateForms(){
    let h=document.getElementById("height").value;
    let w=document.getElementById("weight").value;
    if (!isNaN(h) && !isNaN(w) &&w>0 &&h>0){
      setDBW((h-100)-(0.1*(h-100)));
      if (selectedWeight==="lbs"){
        w=0.453592378*w;  
      }
      setBMI((w/((h/100)*(h/100))).toFixed(1));
      setWeight(w);
      //updating REE
      
      console.log(w,h,Age.year,sex);
      if(sex==="F"&& (Age.year>0 ||Age.month>0)){
        setREE(655.1+(9.6*w)+(1.9*h)-(4.7*Age.year));
      }
      else if(sex==="M"&& (Age.year>0 ||Age.month>0)){
        setREE(65.5+(13.8*w)+(5*h)-(6.8*Age.year));
      }
      else{
        setREE(NaN);
      }
    }
    console.log(h);
    setHeight(h/100);
  }
  return (
    <div className="App">
      <section id="basics" >
        <center><h1>DIET RX</h1></center>
        <div className='flex'>Date of Birth : 
        <Input type="date"
        sx={{ width: 300 }}
        onChange={(event,value)=>{
          const birth=moment(event.target.value);
          const currentDate=moment();
          if ( birth.isValid() && birth.year()>1900) {
            console.log(currentDate.year(), birth.year());
            const yearsDiff = currentDate.diff(birth, 'years');
            const monthsDiff = currentDate.diff(birth, 'months');
            const excessMonths = monthsDiff % 12;
            setAge({year:yearsDiff,month:excessMonths});
          }
        }}
        />
        <div className='flex'>
            Height (in cm):
          <Input
          id="height"
        endDecorator={
          'cm'
        }
        sx={{ width: 300 }}
        
  onChange={()=>{updateForms();}}
      /></div>
      <div className='flex'>
      Weight (in {selectedWeight}):
      <Input
      id="weight"
  endDecorator={
    <Select defaultValue={selectedWeight} 
    id="kglbs"
    onChange={(event,value) => {
      setSelectedWeight(value);
      console.log( value); // Added for debugging purposes
    }}>
      <Option value="kg">kg</Option>
      <Option value="lbs">lbs</Option>
    </Select>
  }
  sx={{ width: 300 }}
  onChange={()=>{updateForms()}}
/>  
      </div>
        
        </div>
        <div className='flex'>
          Sex: <Select
          placeholder="Select Sex at Birth"
          id="sex"
          sx={{ width: 300 }}
          required
          onChange={(_, value) => {console.log(value);setSex(value);changeREE(value);}}>
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
          </Select>
          {sex === "F" && <>
  <div className='flex'>
    Is Pregnant:<Select defaultValue={isPregnant} onChange={(event,value) => {
      setIsPregnant(value);
      console.log( value); // Added for debugging purposes
    }}
    sx={{width:"5dvw"}}>
      <Option value={0}>No</Option>
      <Option value={1}>Yes</Option>
    </Select>
  </div>
  <div className='flex'>
  Is Lactating:<Select defaultValue={isLactating} onChange={(event,value) => {
      setIsLactating(value);
      console.log( value); // Added for debugging purposes
    }}
    sx={{width:"5dvw"}}>
      <Option value={0}>No</Option>
      <Option value={1}>Yes</Option>
    </Select>
  </div>
  </>}
        </div>
        Age:{Age.year>0?<>{Age.year} Years Old</>: Age.month>0?<>{Age.month} months Old</>:null}
        <div className='subsubsection'>BMI: {isNaN(BMI)? "None":BMI}
        <h2>Classification</h2>
        <table>
          <thead><tr><th>Source</th><th>Interpretation</th></tr></thead>
          <tbody>
            <tr><td>WHO Classification</td><td id="WHO">{WHO_BMI?.find(item => BMI > item.lower && BMI <= item.upper)?.class || "Not Classified"}</td></tr>
            <tr><td>QI Classification</td><td id="WHO">{QI?.find(item => BMI > item.lower && BMI <= item.upper)?.class || "Not Classified"}</td></tr>
            <tr><td>Bray(1992)Medical Risks</td><td id="WHO">{Bray?.find(item => BMI > item.lower && BMI <= item.upper)?.class || "None"}</td></tr>
            <tr><td>FAO/WHO Classification</td><td id="WHO">{WHO_BMI?.find(item => BMI > item.lower && BMI <= item.upper)?.class || "Not Classified"}</td></tr>
            <tr><td>Asia Pacific Classification</td><td id="WHO">{AP?.find(item => BMI > item.lower && BMI <= item.upper)?.class || "Not Classified"}</td></tr>
          </tbody>
        </table>
        </div>
      <h2>DBW</h2>
      DBW:{DBW.toFixed(3)}kg <br/>
      %DBW: {(DBW===0)?"0":(current_weight/DBW*100).toFixed(2)} %<br/>
      Interpretation: {DBW_tab?.find(item => ((current_weight/DBW*100).toFixed(2))>= item.lower && ((current_weight/DBW*100).toFixed(2)) < item.upper)?.class || "None"}
      
      <h2>TER/TEA</h2>
        <div className='subsection'>
          <h3>Krause Method</h3>
          <div className='flex'>
            Physical Activity <Select placeholder="Select Activity" id="act" defaultValue={KRTER} sx={{width:"35%"}} onChange={(_,value)=>setKRTER(value)}>
            <Option value={0} label={"Bed Rest, Mobile"} >
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Bed rest, but Mobile
                  </Typography>
                  <Typography level="body-xs">eg. Hospital Patients</Typography>
                </Box>
              </Option>
              <Option value={1} label={"Sedentary"}>
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Sedentary
                  </Typography>
                  <Typography level="body-xs">Mostly Sitting, eg. clerical Work</Typography>
                </Box>
              </Option>
              <Option value={2} label={"Light"}>
              <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Light
                  </Typography>
                  <Typography level="body-xs">eg. tailor, nurse, physician, jeepney driver</Typography>
                </Box>
              </Option>
              <Option value={3} label={"Moderate"}>
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Moderate
                  </Typography>
                  <Typography level="body-xs">eg. carpenter, painter, heavy housework</Typography>
                </Box>
              </Option>
              <Option value={4} label={"Very Active"}>
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Very Active
                  </Typography>
                  <Typography level="body-xs">eg. lumberman, swimmer</Typography>
                </Box>
              </Option>
            </Select>
          </div>
        TEA: {(DBW.toFixed(0)*[27.5,30,35,40,45][KRTER])} Kcal
        </div>
        <div className='subsection'>
          <h3>Harris Benedict Equation</h3>
          <div className='flex'>
            Physical Activity <Select placeholder="Select Activity" id="hb_act" defaultValue={HBPA} sx={{width:"35%"}} onChange={(_,value)=>setHBPA(value)}>
              <Option value={1.2} label={"Sedentary"} >
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Sedentary
                  </Typography>
                  <Typography level="body-xs">light or no exercise, desk job</Typography>
                </Box>
              </Option>
              <Option value={1.375} label={"Light"}>
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Light
                  </Typography>
                  <Typography level="body-xs">Light Exercise/Sports, 1-3 days/week</Typography>
                </Box>
              </Option>
              <Option value={1.55} label={"Moderate"}>
              <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Moderate
                  </Typography>
                  <Typography level="body-xs">Moderate Exercise/Sports, 6-7 days/week</Typography>
                </Box>
              </Option>
              <Option value={1.725} label={"Very Active"}>
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Very Active
                  </Typography>
                  <Typography level="body-xs">Hard Exercise everyday or Exercise 2x/day</Typography>
                </Box>
              </Option>
              <Option value={1.9} label={"Extra Active"}>
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography component="span" level="title-sm">
                    Extra Active
                  </Typography>
                  <Typography level="body-xs">Hard Exercise 2 or more times/day, or training for marathon, triathlon, etc</Typography>
                </Box>
              </Option>
            </Select>
          </div>
          <h4>
          REE :{isNaN(REE)?"0":REE.toFixed(2)}<br/>
          TER :{(isNaN(REE)?"0":(REE*HBPA).toFixed(2))}
          </h4>
        </div>
        <div className='subsection'> 
          <h3>Factorial Method</h3>
            Factorial Method uses the same Physical Activity as Krause
            <h4>
            Traditional BMR: {TBMR} kCal <br/>
            Physical Activity Factor: {[10,30,50,75,100][KRTER]} %<br/>
            kCal from Physical Activity: {PA.toFixed(2)} kCal <br/>
            SDA: {SDA} <br/>
            TER: {TERd} kCal
            </h4>
        </div>
        <div className='subsection'>
          <h3> Weight Distribution</h3>
          in the Assumption of 1 week (gain/loss 1 pound)
          <div className='flex'>
            Weight Goal:<Select defaultValue={0} onChange={(_,value)=>{
              setwdTER(wdTER+500*value);
            }} 
            sx={{width:"20%"}}>
              <Option value={0}>Maintain Weight</Option>
              <Option value={-1}>Loss 1 pound</Option>
              <Option value={1}>Gain 1 pound</Option>
            </Select>
          </div>
          Target TER: {wdTER} kCal
        </div>
        <div className='subsection'>
          <h3> Final TEA</h3>
          <div className='flex'>
            Select TER METHOD: <Select placeholder="SELECT TER METHOD" defaultValue={Method} onChange={(_,value)=>{
              let temp_fter=0;
              if (value===1){
                temp_fter=DBW.toFixed(0)*[27.5,30,35,40,45][KRTER];
              }
              else if (value===2){
                temp_fter=(REE*HBPA).toFixed(2);
              }
              else if (value===3){
               temp_fter=TERd;
              }
              else if (value===4){
                temp_fter=wdTER;
              }
              setMethod(value);
              setfinalTER(temp_fter);
            }
          } 
            sx={{width:"20%"}}>
              <Option value={1}>Tanhauser's with Krause</Option>
              <Option value={2}>Harris Benedict</Option>
              <Option value={3}>Factorial</Option>
              <Option value={4}>EWeight Management</Option>
            </Select>
          </div>
          {(Method===0)?"please Select TER value to be used":
          <h4>
            TER/TEA used : {finalTER};<br/>
            Final TEA: {finalTER+isLactating*500+isPregnant*300} kCal 
          </h4>}
        </div>
      </section>
      
    </div>
  );
}

export default App;
