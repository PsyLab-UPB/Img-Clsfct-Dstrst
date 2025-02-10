/**
 * @title Forms_Classification_Session1
 * @description Session 1 of FormsClassification Lab-version
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
import SurveyMultiChoicePlugin from "@jspsych/plugin-survey-multi-choice";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";
import { FeatureView8 } from "./plugins/FeatureView_8examples";
import ClassificationComponent from "./plugins/ClassificationComponent";
import DifficultyRatingComponent from "./plugins/DifficultyRatingComponent";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();

  const timeline = [];
  const nTrainingBlocks = 8;
  const nTrainingTrials = 4;
  const nTutorialTrials = 10;
  const nTestTrials = 27;
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

   // Age + Gender prompt
   timeline.push({
    timeline: [
      {
        type: SurveyTextPlugin,
        questions: [{ prompt: "Bitte geben Sie Ihre Versuchspersonen-ID an:", required: true }],
        button_label: "Weiter"
      },
      {
        type: SurveyTextPlugin,
        questions: [{ prompt: "Bitte geben Sie Ihr Alter an (in Jahren):", required: true }],
        button_label: "Weiter"
      },
      {
        type: SurveyMultiChoicePlugin,
        questions: [
          {
            prompt: "Bitte geben Sie Ihr Geschlecht an:",
            options: ["männlich", "weiblich", "divers"],
            required: true,
            horizontal: true,
          },
        ],
        button_label: "Weiter",
      },
    ],
  });
 
  // create arrays for the types of forms for the examples
  const imagesExp_A_red = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypA_red")); 
  const imagesExp_A_blue = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypA_blue")); 

  const imagesExp_B_red = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypB_red")); 
  const imagesExp_B_blue = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/examples/TypB_blue"));

  const imagesTutorial_TypeA = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testTutorial_50_50/TypA")).map(str => [str,0]); 
  const imagesTutorial_TypeB = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testTutorial_50_50/TypB")).map(str => [str,1]);

  const imagesTest_TypeA = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testImages_50_50/TypA")).map(str => [str,0]);
  const imagesTest_TypeB = assetPaths.images.filter(str => str.startsWith("assets/images/shapesSession2/testImages_50_50/TypB")).map(str => [str,1]);
  
  const imagesTutorial_all = imagesTutorial_TypeA.concat(imagesTutorial_TypeB)
  const imagesTest_all = imagesTest_TypeA.concat(imagesTest_TypeB)
  const imagesTutorial_shuffled = jsPsych.randomization.shuffle(imagesTutorial_all);
  const imagesTest_shuffled = jsPsych.randomization.shuffle(imagesTest_all);

  const procedure = `
  <p>Ihre Aufgabe in diesem Experiment ist es, zu lernen, die hier verwendeten Formen einem von zwei Typen richtig zuzuordnen. 
     Sie werden zunächst in der <b>Übungsphase</b> die Möglichkeit haben, die korrekte Zuordnung zu lernen und zu üben. 
     Danach beginnt <b>eine erste Probephase</b>, bei der Sie ohne Hilfe Formen zuordnen sollen.
     Dieses Vorgehen wiederholt sich stets einmal, sodass Sie die Übungs- und Probephase jeweils zweimal vollständig bearbeiten. 
     Danach beginnt die eigentliche Testphase des Experiments. Die genauen Instruktionen werden vor jeder Phase angezeigt.</p>
  <p><b>Bitte beachten:</b> Die korrekte Zuordnung der Formen ändert sich im gesamten Experiment <b>nicht</b>. 
     In der Probe- und Testphase werden Ihnen keine Beispiele mehr als Hilfe angezeigt, sodass Sie versuchen sollten, die Zuordnung auswendig zu lernen.</p>
  `
  const procedureTestphase = `
  <p>Nun beginnt die <b>Probephase</b>.</p>
  <p>Hier wird Ihnen eine einzelne Form ohne Beispiele angezeigt. 
     Sie müssen erneut entscheiden, zu welchem Typ die Form gehört und zusätzlich angeben, wie sicher Sie sich mit Ihrem Urteil sind.</p>
  `
  const procedureSecondPractice = `
  <p> Im Anschluss beginnt die <b>zweite Übungsphase</b>. Diese läuft genauso ab, wie die erste Übungsphase. 
      Es werden erneut Beispiele von korrekt zugeordneten Formen beider Typen gezeigt und in 
      unteren Bildschirmmitte wird Ihnen die Figur angezeigt, die Sie entweder dem Typ A oder B zuordnen sollen.
  </p>
  `

  const procedureRatingphase = `
  <p>Sie haben sich mit der Aufgabe ausreichend vertraut gemacht.</p>
  <p>Es folgen nun mehrere Blöcke, in der Sie - wie in der Probephase - erneut entscheiden müssen, zu welchem der beiden Typen die gezeigt Form gehört.
     Zusätzlich müssen Sie erneut angeben, wie sicher Sie sich mit Ihrem Urteil sind.
  </p>
  <p>Insgesamt folgen 8 Blöcke mit jeweils 27 Durchgängen. Ihnen werden in reglemäßigen Abständen Pausen angeboten.</p>
  `

  const procedureEndscreen = `
  <p>Sie haben das Experiment abgeschlossen. Klicken Sie auf 'Weiter', um das Experiment abzuschließen und geben Sie der Versuchsleitung Bescheid.</p>
  `
  
  // array for different introductions
  const introduction = {
    basicCombined: `
    <p>Im Folgenden werden Ihnen verschiedene Formen gezeigt. Es gibt zwei Typen von Formen: Typ A und Typ B. Ihre Aufgabe ist es, einzelne Formen dem richtigen Typ zu zuordnen.</p> 
    <p>Sie erhalten keine direkten Informationen über die Regeln der korrekten Zuordnung. Ihnen werden lediglich Beispiele von korrekt zugeordneten Formen beider Typen gezeigt.</p>
    <p>Auf der linken Seite des Bildschirms, werden Formen des Typs A angezeigt. Auf der rechten Seite des Bildschirms, werden Formen des Typs B angezeigt.</p>
    <p>In der unteren Bildschirmmitte wird Ihnen die Figur angezeigt, die Sie entweder dem Typ A oder dem Typ B zuordnen sollen.</p>
    <p>Jede Figur lässt sich anhand Ihrer Eigenschaften eindeutig Typ A oder B zuordnen.</p> 
    <p>Nach jedem vierten Durchgang werden Ihnen neue Beispiele von korrekt zugeordneten Formen präsentiert.</p>  
                
    `,
    featureCombined: `
    <p>Im Folgenden haben Sie zunächst die Möglichkeit die Zuteilung der Formen in die <b>beiden Typen zu lernen</b>.
       Dafür werden Ihnen verschiedene Formen gezeigt. Es gibt zwei Typen von Formen: Typ A und Typ B. Ihre Aufgabe ist es, einzelne Formen dem richtigen Typ zuzuordnen.</p>
    <p>Sie erhalten keine direkten Informationen über die Regeln der korrekten Zuordnung. Sie erhalten lediglich Beispiele von korrekt zugeordneten Formen beider Typen und folgende Information:</p>
    <p>Entscheidend für die Zuordnung der Formen können sein: die <b>Farbe</b>, das <b>Verhältnis von Breite und Höhe</b> und die <b>gekrümmte Linie</b> der Formen. 
       Auf der linken Seite des Bildschirms werden Formen des Typs A angezeigt. Auf der rechten Seite des Bildschirms werden Formen des Typs B angezeigt.
       In der unteren Bildschirmmitte wird Ihnen die Figur angezeigt, die Sie entweder dem Typ A oder dem Typ B zuordnen sollen.</p>
    <p>Jede Figur lässt sich anhand ihrer Eigenschaften eindeutig Typ A oder B zuordnen. 
       Nach jedem vierten Durchgang werden Ihnen neue Beispiele von korrekt zugeordneten Formen präsentiert. Insgesamt gibt es 32 Durchgänge zur Übung.</p>            
    `,
  }

  // array for different instructions
  const instruction = {
    basicCombined: `
    <p>Hier sehen Sie Beispiele von korrekt zugeordneten Formen.</p>
    <p>Auf der linken Seite sehen Sie Formen des Typs A.</p>
    <p>Auf der rechten Seite sehen Sie Formen des Typs B.</p>
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
  
  // loop rating task
  timeline.push({
      type: HtmlButtonResponsePlugin,
      stimulus: procedureTestphase,
      choices: ["Weiter"]
    })
  for (let trial = 0; trial < nTutorialTrials; trial++) {
    timeline.push({
      type: ClassificationComponent,
      image: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials + trial][0], // not repeating training images
      play_feedback:true,
      category_prompt: "Zu welchem Typ gehört das Bild ?", 
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
      }
    })
  }
  
  /* 
  SECOND TRY
  */
  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: procedureSecondPractice,
    choices: ["Weiter"]
  })
  // loop for training trials with examples
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
  // loop rating task - tutorial
  for (let trial = 0; trial < nTutorialTrials; trial++) {
    timeline.push({
      type: ClassificationComponent,
      image: imagesTutorial_shuffled[nTrainingBlocks*nTrainingTrials*2 + nTutorialTrials + trial][0],
      play_feedback:true,
      category_prompt: "Zu welchem Typ gehört das Bild ?",
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
      }
    })
  }

  timeline.push({
    type: HtmlButtonResponsePlugin,
    stimulus: procedureRatingphase,
    choices: ["Weiter"]
  })

  // main loop rating task
  for (let block = 0; block < 8; block++) {
    for (let trial = 0; trial < nTestTrials; trial++) {
      timeline.push({
        type: ClassificationComponent,
        image: imagesTest_shuffled[block*nTestTrials + trial][0],
        play_feedback:true,
        category_prompt: "Zu welchem Typ gehört das Bild ?", 
        category_Names:[
          {categoryName:"Typ A", categoryRight: imagesTest_shuffled[block*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Typ B", categoryRight: imagesTest_shuffled[block*nTestTrials + trial][1]==1?true:false}
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
          image: imagesTest_shuffled[block*nTestTrials + trial][0],
        }
      })
    }
    if ((block+1) % 3 === 0) {
      timeline.push({
        type: HtmlButtonResponsePlugin,
        stimulus: "Sie haben "+(block+1)+" von 8 Blöcken absolviert. Sie können eine kurze Pause einlegen. Um das Experiment fortzusetzen, klicken Sie auf Weiter.",
        choices: ["Weiter"]
      })
    }
  }

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
    type: HtmlButtonResponsePlugin,
    stimulus: procedureEndscreen,
    choices: ["Weiter"]
  })

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}