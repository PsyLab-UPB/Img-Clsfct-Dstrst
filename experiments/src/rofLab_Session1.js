/**
 * @title RoF_Classification_Session1_Lab-version
 * @description Session 1 of RoF-Classification Lab-version
 * @version 1.1.1
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
import ClassificationComponent_rof from "./plugins/ClassificationComponent_rof";
import BrowserCheck from "@jspsych/plugin-browser-check";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();

  const timeline = [];
  const nTestTrials = 27;
  
  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  timeline.push({
    type: BrowserCheck,
    skip_features:["webcam", "microphone"],
    inclusion_function: (data) => {
      return data.width >= 1025 && data.height >=769
      },
    allow_window_resize: true,
    minimum_width: 1024,
    minimum_height: 768,
    exclusion_message:  (data) => { 
      if(data.height < 769 || data.width < 1025) {
        return 'Sorry! Your browser size does not meet the requirements to participate in this experiment. Please return your submission! You will be returned to Prolific.'
      } 
    }

  })

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
  const imagesTest_real = assetPaths.images.filter(str => str.startsWith("assets/rof/real")).map(str => [str,0]);
  const imagesTest_fake = assetPaths.images.filter(str => str.startsWith("assets/rof/fake")).map(str => [str,1]);

  const imagesTest_all = imagesTest_fake.concat(imagesTest_real);
  const imagesTest_shuffled = jsPsych.randomization.shuffle(imagesTest_all);

  const procedure = `
  <p>Ihre Aufgabe in diesem Experiment ist es, eine Einschätzung in Bezug auf die Echtheit verschiedener Bilder zu treffen.</p>
  <p>Es können <b>echte Fotos oder fake Bilder</b> von Personen oder Objekten (Gegenstände, Landschaften, Tiere) vorkommen.</p>
  <p><b>Fake meint in diesem Experiment von Künstlicher Intelligenz generierte Bilder.</b><br>
  Dies umfasst nicht: Die Nachbearbeitung von Fotos durch z.B. leichte Veränderungen eines Fotos mittels z.B. Photoshop, Einfügen von Personen/Objekten vor einem neuen Hintergrund, etc.</p> 
  <p>Bei manchen der Bilder kann die Entscheidung leichtfallen, bei manchen ist die Entscheidung schwieriger. 
  <p>Denken Sie nicht zu lange über Ihre Antwort nach, geben Sie ein intuitives Urteil ab.</p> 
  <p>Versuchen Sie die Aufgabe so gut wie Ihnen möglich zu bearbeiten! Die besten 5% aller Versuchsteilnehmer*innen erhalten für Ihre Leistung eine Bonuszahlung.
   Es folgen 8 Blöcke mit je 27 Durchgängen. Sie haben in regelmäßigen Abständen die Möglichkeit eine kurze Pause einzulegen.
  </p>
  `

  const procedureEndscreen = `
  <p>Sie haben das Experiment abgeschlossen. Klicken Sie auf 'Weiter', um ihre Daten abzuschicken und geben Sie der Versuchsleitung Bescheid.</p>
  `
  
  // introduction
  timeline.push(
    {
      type: HtmlButtonResponsePlugin,
      stimulus: procedure,
      choices: ["Weiter"]
    }
  )

  // main loop rating task
  for (let block = 0; block < 8; block++) {
    for (let trial = 0; trial < nTestTrials; trial++) {
      timeline.push({
        type: ClassificationComponent_rof,
        image: imagesTest_shuffled[block*nTestTrials + trial][0],
        play_feedback:true,
        category_prompt: "Wie würden Sie dieses Bild einschätzen?",
        category_Names:[
          {categoryName:"Echt", categoryRight: imagesTest_shuffled[block*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Fake", categoryRight: imagesTest_shuffled[block*nTestTrials + trial][1]==1?true:false}
        ],
        likert_prompt: "Wie sicher sind Sie sich in Ihrer Einschätzung?",
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
      prompt:"Für die Bilder auf denen Gesichter gezeigt waren: Wie sind bei Ihrer Entscheidung vorgegangen bzw. woran habe Sie erkannt, ob Bilder echt oder fake sind?", 
      rows: 10,
      columns: 140,
      },
      {
        prompt:"Für die Bilder auf denen Objekte gezeigt waren: Wie sind bei Ihrer Entscheidung vorgegangen bzw. woran habe Sie erkannt, ob Bilder echt oder fake sind?", 
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