/**
 * @title Forms_Classification_Session2
 * @description Session 2 of FormsClassification Lab-version
 * @version 1.1.0
 *
 * @assets assets/
 * @imageDir images
 * @audioDir audio/feedback
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import SurveyLikertPlugin from "@jspsych/plugin-survey-likert";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";
import { FeatureView8 } from "./plugins/FeatureView_8examples";
import ClassificationComponent from "./plugins/ClassificationComponent";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();

  const timeline = [];
  const timelineTutorial = []; 
  const nTrainingBlocks = 3;
  const nTrainingTrials = 4;
  const nTutorialTrials = 20;
  const nTestTrials = 24;

  let nCorrect = 0;
  let skip2Tutorial = false;

  let condition = 'none';

  var selectedCondition = 1; 
  
  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  // Switch to fullscreen
  timeline.push({
    type: FullscreenPlugin,
    fullscreen_mode: true,
  });

   // VP-ID prompt
   timeline.push({
    timeline: [
      {
        type: SurveyTextPlugin,
        questions: [{ prompt: "Bitte geben Sie Ihre Versuchspersonen-ID ein:", required: true }],
        button_label: "Weiter",
        on_finish: () => {
          console.log(jsPsych.data.getLastTrialData()['trials'][0]['response']['Q0'] % 2 === 0)
          if (jsPsych.data.getLastTrialData()['trials'][0]['response']['Q0'] % 2 === 0) {
            condition = 1       
          } else {
            condition = 2
          }
          console.log(condition)
        }
      },
    ],
  });

  const kiInfoCond1_new = `
  <p>Sie haben sich mit der Aufgabe ausreichend vertraut gemacht.</p>
  <p><b>Im Folgenden erhalten Sie nun KI-Unterstützung.</b> Die auf die Klassifikation der Formen trainierte KI wurde bereits
   erfolgreich evaluiert. Da eine Vorstudie zeigte, dass die Probanden Schwierigkeiten hatten, kleinere und relevante
   Unterschiede im Höhen-Breiten-Verhältnis der Formen zu erkennen, wurde die <b>KI speziell hierauf trainiert</b>. 
  </p>
  <p>Dadurch kann es immer noch gelegentlich zu Fehlklassifikationen kommen. Insgesamt weist die KI aber eine
  sehr gute Performanz auf. </p>
  <p><b>Nutzen Sie daher die KI-Klassifikationen als Hilfe bei Ihrer Entscheidung!</b></p>`

  const kiInfoCond2_new = `
  <p>Sie haben sich mit der Aufgabe ausreichend vertraut gemacht.</p>
  <p><b>Im Folgenden erhalten Sie nun KI-Unterstützung.</b> Die auf die Klassifikation der Formen trainierte KI wurde bereits
   erfolgreich evaluiert. Da eine Vorstudie zeigte, dass die Probanden Schwierigkeiten hatten, kleinere und relevante
   Unterschiede im Höhen-Breiten-Verhältnis der Formen zu erkennen, wurde die <b>KI speziell hierauf trainiert</b>. 
  </p>
  <p> Insgesamt weist die KI eine sehr gute Performanz auf. Durch den Fokus beim Training der KI kann es aber immer noch 
  <b>gelegentlich zu Fehlklassifikationen</b> kommen.</p>
  <p>Diese Fehler können für Menschen teilweise sehr offensichtlich sein.
   Auch für weniger offensichtliche Fälle haben bisherige Untersuchungen gezeigt, 
   dass Menschen oft eine gute Intuition haben und durch kritisches Prüfen gut erkennen können, 
   wann eine falsche Klassifikation vorliegt. </p>
  <p><b>Nutzen Sie daher die KI-Klassifikationen als Hilfe</b> bei Ihrer Entscheidung, <b>aber prüfen Sie stets</b> für sich,
   <b>ob Ihnen die KI-Klassifikationen sinnvoll erscheinen</b>.</p>  
  `
 
  // create arrays for the types of forms
  const imagesExp_A_red = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypA_red")); 
  const imagesExp_A_blue = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypA_blue")); 

  const imagesExp_B_red = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypB_red")); 
  const imagesExp_B_blue = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypB_blue")); 

  const imagesTutorial_TypeA = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testTutorial_50_50/TypA")).map(str => [str,0]);
  const imagesTutorial_TypeB = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testTutorial_50_50/TypB")).map(str => [str,1]);

  const imagesTest_TypeA = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testImages_50_50/TypA")).map(str => [str,0]);
  const imagesTest_TypeB = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testImages_50_50/TypB")).map(str => [str,1]);
  
  const imagesTutorial_all = imagesTutorial_TypeA.concat(imagesTutorial_TypeB);
  const imagesTutorial_shuffled = jsPsych.randomization.shuffle(imagesTutorial_all);

  const imagesTest_all = imagesTest_TypeA.concat(imagesTest_TypeB);
  const imagesTest_shuffled = jsPsych.randomization.shuffle(imagesTest_all);

  const procedure = `
  <p>Ihre Aufgabe in diesem Experiment ist ähnlich wie in der ersten Sitzung des Experiments.</p>
  <p>Sie arbeiten erneut mit der gleichen Art von Bildmaterial. Sie müssen die geometrischen Formen erneut dem Typ A oder Typ B zuordnen.
     Das Prinzip der korrekten Zuordnung ist identisch zur ersten Sitzung des Experiments.
     Sie werden zunächst in der <b>Wiederholungsphase</b> die Möglichkeit haben, Ihr Wissen zur Zuordnung aufzufrischen und zu üben. 
     Die Wiederholungsphase läuft wie die erste Sitzung ab, nur als eine verkürzte Version. </p>
  <p>Danach folgt eine neue Phase, in der Sie <b>Unterstützung in Form von KI-gestützter Bildklassifikationen</b> erhalten.
     Die KI wurde darauf trainiert, die hier verwendeten Formen dem Typ A oder Typ B korrekt zuzuordnen.
     Nutzen Sie diese KI-Hilfe </b> bei Ihrer Entscheidung, ob eine Form dem Typ A oder Typ B zugeordnet werden sollte.

  <p><b>Bitte beachten:</b> Die korrekte Zuordnung der Formen ändert sich im gesamten Experiment <b>nicht</b>. 
     In der späteren Phase des Experiments werden Ihnen keine Beispiele mehr als Hilfe angezeigt, sodass Sie versuchen sollten, die Zuordnung auswendig zu lernen.</p>
  `
  const procedureTestphase = `
  <p>Nun werden Ihnen eine einzelne Form ohne Beispiele angezeigt. </p>
  <p>Sie müssen erneut entscheiden, zu welcher Kategorie die Form gehört und zusätzlich angeben, wie sicher Sie sich mit Ihrem Urteil sind.</p>
  `

  const procedureEndscreen = `
  <p>Sie haben das Experiment abgeschlossen. Klicken Sie auf 'Weiter', um das Experiment abzuschließen und geben Sie der Versuchsleitung Bescheid.</p>
  `
  
  // array for different introductions
  const introduction = {
    basicCombined: `
    `,
    featureCombined: `
    <p>Im Folgenden haben Sie zunächst die Möglichkeit, die <b>korrekte Zuteilung der Formen in die beiden Typen zu üben</b>.
       Dafür werden Ihnen verschiedene Formen gezeigt. Es gibt zwei Typen von Formen: Typ A und Typ B. Ihre Aufgabe ist es, einzelne Formen dem richtigen Typ zuzuordnen.</p>
    <p>Sie erhalten keine direkten Informationen über die Regeln der korrekten Zuordnung. Sie erhalten lediglich Beispiele von korrekt zugeordneten Formen beider Typen und folgende Information:</p>
    <p>Entscheidend für die Zuordnung der Formen können sein: die <b>Farbe</b>, das <b>Verhältnis von Breite und Höhe</b> und die <b>gekrümmte Linie</b> der Formen. 
       Auf der linken Seite des Bildschirms werden Formen des Typs A angezeigt. Auf der rechten Seite des Bildschirms werden Formen des Typs B angezeigt.
       In der unteren Bildschirmmitte wird Ihnen die Figur angezeigt, die Sie entweder dem Typ A oder dem Typ B zuordnen sollen.</p>
    <p>Jede Figur lässt sich anhand ihrer Eigenschaften eindeutig Typ A oder B zuordnen. 
       Nach jedem vierten Durchgang werden Ihnen neue Beispiele von korrekt zugeordneten Formen präsentiert. Insgesamt gibt es 12 Durchgänge zur Übung.</p>            
    `,
  }

  // array for different instructions
  const instruction = {
    basicCombined: ` 
    `,
    featureCombined: `
    <p>Hier sehen Sie Beispiele von korrekt zugeordneten Formen.</p>
    <p>Auf der linken Seite sehen Sie Formen des Typs A.</p>
    <p>Auf der rechten Seite sehen Sie Formen des Typs B.</p>
    <p>Entscheidend für die Zuordnung der Formen können sein: die <b>Farbe</b>, das <b>Verhältnis von Breite und Höhe</b> und die <b>gekrümmte Linie</b> der Formen. </p>
    `,
  }

  // changes based on condition
  let selectedIntroduction;
  let selectedInstruction;
  if (selectedCondition == 0) {
    selectedIntroduction = introduction.basicCombined;
    selectedInstruction = instruction.basicCombined;
  } else {
    selectedIntroduction = introduction.featureCombined;
    selectedInstruction = instruction.featureCombined;
  }
  // introduction
  timeline.push(
    {
      type: HtmlButtonResponsePlugin,
      stimulus: procedure,
      choices: ["Weiter"]
    },
    {
      type: HtmlButtonResponsePlugin,
      stimulus: selectedIntroduction,
      choices: ["Weiter"]
  }
  )

  // loop for training trials with examples
  for (let block = 0; block < nTrainingBlocks; block++) {
    // ensure 2 subtype examples of each type; shuffle test images
    const imagesA_selection = imagesExp_A_red.slice(block*2, (block*2)+2).concat(
      imagesExp_A_blue.slice(block*2, (block*2)+2));
    const imagesA_selectionShuffled = jsPsych.randomization.shuffle(imagesA_selection);
    const imagesB_selection = imagesExp_B_red.slice(block*2, (block*2)+2).concat(
      imagesExp_B_blue.slice(block*2, (block*2)+2));
    const imagesB_selectionShuffled = jsPsych.randomization.shuffle(imagesB_selection);
    
    // create trials
    for (let trial = 0; trial < nTrainingTrials; trial++) {
      timeline.push((new FeatureView8(
        selectedInstruction,
        imagesA_selectionShuffled,
        imagesB_selectionShuffled,
        imagesTutorial_shuffled[(block*4)+trial][0],
        true,
        imagesTutorial_shuffled[(block*4)+trial][1]
      )))
    }
  }

  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: procedureTestphase,
    choices: ["Weiter"]
  })

  // loop rating task
  for (let trial = 0; trial < nTutorialTrials; trial++) {
    timeline.push({
      type: ClassificationComponent,
      image: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials + trial][0],
      play_feedback:true,
      category_prompt: "Zu welchem Typ gehört diese Form?",
      category_Names:[
        {categoryName:"Typ A", categoryRight: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials + trial][1]==0?true:false},
        {categoryName:"Typ B", categoryRight: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials + trial][1]==1?true:false}
      ],
      likert_prompt: "Wie sicher sind Sie sich in Ihrer Einteilung?",
      likert_items:[
        {itemName:"sehr unsicher"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"sehr sicher"}
      ],
      data : {
        image: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials + trial][0],
        correctAnswer: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials + trial][1]==0?"Typ A":"Typ B"},
      // counting for optional second tutorial
      on_finish: function (data) {
        if ( (data["category"] === data["correctAnswer"]) ) {
          nCorrect++;     
        }
        if ((nCorrect/nTutorialTrials >= 0.75) && (skip2Tutorial === false)) {
          skip2Tutorial=true;
        }
        console.log(skip2Tutorial)
        console.log(nCorrect);   
        console.log(data);   
      },
    })
  }

  const tutorialSubTimeline = {
    timeline: timelineTutorial,
    timeline_variables: [1],
  };
  timelineTutorial.push({
    type: HtmlButtonResponsePlugin,
    stimulus: `<p>Sie haben erneut die Möglichkeit zu üben.</p>`,
    choices: ["Weiter"]
  })

  for (let block = nTrainingBlocks; block < nTrainingBlocks*2; block++) {
    // ensure 2 subtype examples of each type; shuffle test images
    const imagesA_selection = imagesExp_A_red.slice(block*2, (block*2)+2).concat(
      imagesExp_A_blue.slice(block*2, (block*2)+2));
    const imagesA_selectionShuffled = jsPsych.randomization.shuffle(imagesA_selection);
    const imagesB_selection = imagesExp_B_red.slice(block*2, (block*2)+2).concat(
      imagesExp_B_blue.slice(block*2, (block*2)+2));
    const imagesB_selectionShuffled = jsPsych.randomization.shuffle(imagesB_selection);
    
    // create trials
    for (let trial = 0; trial < nTrainingTrials; trial++) {
      timelineTutorial.push((new FeatureView8(
        selectedInstruction,
        imagesA_selectionShuffled,
        imagesB_selectionShuffled,
        imagesTutorial_shuffled[(block*nTrainingTrials) + nTutorialTrials + trial][0],
        true,
        imagesTutorial_shuffled[(block*nTrainingTrials) + nTutorialTrials + trial][1]
      )))
    }
  }

  timelineTutorial.push({
    type: HtmlButtonResponsePlugin,
    stimulus: procedureTestphase,
    choices: ["Weiter"]
  })

  for (let trial = 0; trial < nTutorialTrials; trial++) {
    timelineTutorial.push({
      type: ClassificationComponent,
      image: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials*2 + nTutorialTrials + trial][0],
      play_feedback:true,
      category_prompt: "Zu welchem Typ gehört diese Form?",
      category_Names:[
        {categoryName:"Typ A", categoryRight: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials*2 + nTutorialTrials + trial][1]==0?true:false},
        {categoryName:"Typ B", categoryRight: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials*2 + nTutorialTrials + trial][1]==1?true:false}
      ],
      likert_prompt: "Wie sicher sind Sie sich in Ihrer Einteilung?",
      likert_items:[
        {itemName:"sehr unsicher"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"-"},
        {itemName:"sehr sicher"}
      ],
      data : {
        image: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials*2 + nTutorialTrials + trial][0],
        correctAnswer: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials*2 + nTutorialTrials + trial][1]==0?"Typ A":"Typ B"},
    })
  }

  var if_node = {
    timeline: [tutorialSubTimeline],
    conditional_function: function(){
       if (skip2Tutorial) {
            return false;
        } else {
            return true;
        }
    }
  }
  timeline.push(if_node);

  // KI-Info Grp A or B
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: () => {
      if (condition === 1) {
        return kiInfoCond1_new
        } else {
          return kiInfoCond2_new
        }
    },
    choices: ['Weiter']
  })
  
  // note for no feedback anymore
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: `<p>Bitte beachten: Ab sofort erhalten Sie <b>kein auditives Feedback mehr</b>, ob Sie richtig oder falsch geantwortet haben.</p>`,
    choices: ["Verstanden."]
  })

  // 2 blocks with very good prcntCorrect
  var prcntCorrect = 0.9;
  for (let subBlock = 0; subBlock < 2; subBlock++) {
    for (let trial = 0; trial < nTestTrials; trial++) {
      timeline.push({
        type: ClassificationComponent,
        image: imagesTest_shuffled[subBlock*nTestTrials + trial][0],
        play_feedback:false,
        category_prompt: () => {
          let prompt;
          if(jsPsych.randomization.sampleBernoulli(prcntCorrect)) { 
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[subBlock*nTestTrials + trial][1]==0?"<b>Typ A</b>":"<b>Typ B</b>")+`
                      </br> </br> </br>Zu welchem Typ gehört diese Form?`
                    
          } else {
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[subBlock*nTestTrials + trial][1]==1?"<b>Typ A</b>":"<b>Typ B</b>")+`
                      </br> </br> </br>Zu welchem Typ gehört diese Form?`    
          }
          return prompt;          
        },
        category_Names:[
          {categoryName:"Typ A", categoryRight: imagesTest_shuffled[subBlock*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Typ B", categoryRight: imagesTest_shuffled[subBlock*nTestTrials + trial][1]==1?true:false}
        ],
        likert_prompt: "Wie sicher sind Sie sich in Ihrer Einteilung?",
        likert_items:[
          {itemName:"sehr unsicher"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"sehr sicher"}
        ],
        data : {
          image: imagesTest_shuffled[subBlock*nTestTrials + trial][0],
        },
        on_finish: function(data) { 
          let prompt = jsPsych.getCurrentTrial().category_prompt;
          data.usedPrompt = prompt;
          console.log(data);   
        }
      })
    }
  }
  
  const query = {
    type: SurveyLikertPlugin,
    questions: [
      {
        prompt: "Wie häufig nutzen Sie die KI-Klassifikationen für Ihre Entscheidung?",
        labels: [
          "Gar nicht",
          "Selten",
          "Manchmal",
          "Oft",
          "Immer"
        ],
        required: true
      },
      {
        prompt: "Wie sehr misstrauen Sie der KI-Klassifikationen?",
        labels: [ 
          "Gar nicht",
          "Ein wenig",
          "Etwas",
          "Stark", 
          "Sehr stark", 
        ],
        required: true
      },
      {
        prompt: "Wie sehr vertrauen Sie der KI-Klassifikationen?",
        labels: [ 
          "Gar nicht",
          "Ein wenig",
          "Etwas",
          "Stark",
          "Sehr stark",
        ],
        required: true
      }
    ]
  }

  timeline.push(query)
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: `Sie haben 1 von 5 Blöcken absolviert. Sie können eine kurze Pause einlegen. Um das Experiment fortzusetzen, klicken Sie auf Weiter.`,
    choices: ["Weiter"]
  })  
   
  for (let subBlock = 0; subBlock < 4; subBlock++) {
    for (let trial = 0; trial < nTestTrials; trial++) {
      timeline.push({
        type: ClassificationComponent,
        image: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][0], 
        play_feedback:false,
        category_prompt: () => {
          let prompt;
          if(jsPsych.randomization.sampleBernoulli(prcntCorrect - (0.15*subBlock))) { 
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==0?"<b>Typ A</b>":"<b>Typ B</b>")+`
                      </br> </br> </br>Zu welchem Typ gehört diese Form?`
                    
          } else {
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==1?"<b>Typ A</b>":"<b>Typ B</b>")+`
                      </br> </br> </br>Zu welchem Typ gehört diese Form?`    
          }
          return prompt;          
        },
        category_Names:[
          {categoryName:"Typ A", categoryRight: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Typ B", categoryRight: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==1?true:false}
        ],
        likert_prompt: "Wie sicher sind Sie sich in Ihrer Einteilung?",
        likert_items:[
          {itemName:"sehr unsicher"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"sehr sicher"}
        ],
        data : {
          image: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][0],
        },
        on_finish: function(data) { 
          let prompt = jsPsych.getCurrentTrial().category_prompt;
          data.usedPrompt = prompt;
          console.log(data);   
        }
      })
    }
    if (subBlock == 1) {
      timeline.push(query)
      timeline.push({
        type: HtmlButtonResponsePlugin,
        stimulus: `Sie haben 2 von 5 Blöcken absolviert. Sie können eine kurze Pause einlegen. Um das Experiment fortzusetzen, klicken Sie auf Weiter.`,
        choices: ["Weiter"]
      })
    }
  }

  timeline.push(query)
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: `Sie haben 3 von 5 Blöcken absolviert. Sie können eine kurze Pause einlegen. Um das Experiment fortzusetzen, klicken Sie auf Weiter.`,
    choices: ["Weiter"]
  })
  
  // 2 blocks with very good prcntCorrect
  for (let subBlock = 0; subBlock < 3; subBlock++) {
    for (let trial = 0; trial < nTestTrials; trial++) {
      timeline.push({
        type: ClassificationComponent,
        image: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][0], 
        play_feedback:false,
        category_prompt: () => {
          let prompt;
          if(jsPsych.randomization.sampleBernoulli(prcntCorrect)) { 
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==0?"<b>Typ A</b>":"<b>Typ B</b>")+`
                      </br> </br> </br>Zu welchem Typ gehört diese Form?`
                    
          } else {
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==1?"<b>Typ A</b>":"<b>Typ B</b>")+`
                      </br> </br> </br>Zu welchem Typ gehört diese Form?`    
          }
          return prompt;          
        },
        category_Names:[
          {categoryName:"Typ A", categoryRight: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Typ B", categoryRight: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==1?true:false}
        ],
        likert_prompt: "Wie sicher sind Sie sich in Ihrer Einteilung?",
        likert_items:[
          {itemName:"sehr unsicher"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"-"},
          {itemName:"sehr sicher"}
        ],
        data : {
          image: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][0],
        },
        on_finish: function(data) { 
          let prompt = jsPsych.getCurrentTrial().category_prompt;
          data.usedPrompt = prompt;
          console.log(data);   
        }
      })
    }
    if (subBlock == 1) {
      timeline.push(query)
      timeline.push({
        type: HtmlButtonResponsePlugin,
        stimulus: `Sie haben 4 von 5 Blöcken absolviert. Sie können eine kurze Pause einlegen. Um das Experiment fortzusetzen, klicken Sie auf Weiter.`,
        choices: ["Weiter"]
      })
    }
  }

  timeline.push(query)
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: `Sie haben 5 von 5 Blöcken absolviert. Klicken Sie auf Weiter um die Abschlussfragen zu beantworten.`,
    choices: ["Weiter"]
  })


  // open questions
  timeline.push({
    type: SurveyTextPlugin,
    questions: [
      {
      prompt:"Wie sind Sie bei der Zuordnung für Formen des Typs A vorgegangen bzw. woran habe Sie Formen des Typs A erkannt?", 
      rows: 10,
      columns: 140,
      },
      {
        prompt:"Wie sind Sie bei der Zuordnung für Formen des Typs B vorgegangen bzw. woran habe Sie Formen des Typs B erkannt?", 
        rows: 10,
        columns: 140,
        },
      ],
      button_label: "Weiter",
  })
  timeline.push({
    type: SurveyLikertPlugin,
    questions: [
      {
        prompt: "Wie viel Erfahrung bzw. Berührungspunkte hatten Sie vor dem Experiment mit KI-gestützten Bildklassifikationen?",
        labels: [
          "Gar keine",
          "Wenig",
          "Einige",
          "Viel",
          "Sehr viel",
        ],
        required: true
      },
      {
        prompt: "Wie viel Erfahrung bzw. Berührungspunkte hatten Sie vor dem Experiment mit KI-gestützten Anwendungen generell?",
        labels: [
          "Gar keine",
          "Wenig",
          "Einige",
          "Viel",
          "Sehr viel",
        ],
        required: true
      }
    ]
  })

  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: procedureEndscreen,
    choices: ["Weiter"]
  })

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
