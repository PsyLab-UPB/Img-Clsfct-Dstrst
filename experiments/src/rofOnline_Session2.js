/**
 * @title RoF_Classification_Session2
 * @description Session 2 of RoF-Classification Online-version
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
import SurveyLikertPlugin from "@jspsych/plugin-survey-likert";
import SurveyTextPlugin from "@jspsych/plugin-survey-text";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";
import ClassificationComponent_rof from "./plugins/ClassificationComponent_rof";
import BrowserCheck from "@jspsych/plugin-browser-check";
import md5 from "md5";

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();

  const timeline = [];
  const nTestTrials = 24;

  let condition = 'none';
  
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
        return '<p>Your browser does not meet the requirements to participate in this experiment.</p>'
      }
    }
  })

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
        questions: [{ prompt: "Bitte geben Sie Ihre Prolific-ID ein:", required: true }],
        button_label: "Weiter",
        on_finish: () => {
          const hashedID = md5(jsPsych.data.getLastTrialData()['trials'][0]['response']['Q0'])
          const hashedIDdigit = hashedID.slice(-1).charCodeAt(0);
          if (hashedIDdigit % 2 === 0) {
            condition = 1       
          } else {
            condition = 2
          }
        }
      },
    ],
  });

  const kiInfoCond1_new = `
  <p>Im Folgenden erhalten Sie nun KI-Unterstützung. Die auf die Klassifikation der Bilder trainierte KI wurde bereits
   erfolgreich evaluiert. 
  </p>
  <p>Es kann zwar immer noch gelegentlich zu Fehlklassifikationen kommen, aber insgesamt weist die KI eine
  sehr gute Performanz auf. <br>
  <b>Nutzen Sie daher die KI-Klassifikationen als Hilfe bei Ihrer Entscheidung!</b></p>
  <br> <br>
  <p>Um sicherzustellen, dass Sie die obigen Informationen zur KI-Unterstützung gelesen und verstanden haben: 
   Fassen Sie bitte die Informationen zur KI-Unterstützung kurz zusammen (Stichpunkte genügen):
  </p>
  `

  const kiInfoCond2_new = `
  <p>Im Folgenden erhalten Sie nun KI-Unterstützung. Die auf die Klassifikation der Bilder trainierte KI wurde bereits
   erfolgreich evaluiert. 
  </p>
  <p> Insgesamt weist die KI eine sehr gute Performanz auf. Es kann aber immer noch 
  gelegentlich zu Fehlklassifikationen kommen.</p>
  <p>Diese Fehler können für Menschen teilweise sehr offensichtlich sein.
   Auch für weniger offensichtliche Fälle haben bisherige Untersuchungen gezeigt, 
   dass Menschen oft eine gute Intuition haben und durch kritisches Prüfen gut erkennen können, 
   wann eine falsche Klassifikation vorliegt. </p>
  <p><b>Nutzen Sie daher die KI-Klassifikationen als Hilfe bei Ihrer Entscheidung, aber prüfen Sie stets für sich,
   ob Ihnen die KI-Klassifikationen sinnvoll erscheinen.</b></p> 
  <br> <br>
  <p> Um sicherzustellen, dass Sie die obigen Informationen zur KI-Unterstützung gelesen und verstanden haben: 
   Fassen Sie bitte die Informationen zur KI-Unterstützung kurz zusammen (Stichpunkte genügen):
  </p> 
  `

 
  // create arrays for the types of forms
  const imagesTest_real = assetPaths.images.filter(str => str.startsWith("assets/rof/real")).map(str => [str,0]);
  const imagesTest_fake = assetPaths.images.filter(str => str.startsWith("assets/rof/fake")).map(str => [str,1]);

  const imagesTest_all = imagesTest_fake.concat(imagesTest_real);
  const imagesTest_shuffled = jsPsych.randomization.shuffle(imagesTest_all);

  const procedure = `
  <p>Herzlich Willkommen zur zweiten Sitzung! Ihre Aufgabe in diesem Experiment ist ähnlich, wie in der ersten Sitzung des Experiments: 
   Sie arbeiten erneut mit der gleichen Art von Bildmaterial. Ihre Aufgabe ist es, erneut eine Einschätzung in Bezug auf die Echtheit 
   verschiedener Bilder zu treffen. 
   Es können <b>echte Fotos oder fake Bilder</b> von Personen oder Objekten (Gegenstände, Landschaften, Tiere) vorkommen.</p>
  <p>Fake meint weiterhin von Künstlicher Intelligenz generierte Bilder.<br>
  Dies umfasst nicht: Die Nachbearbeitung von Fotos durch z.B. leichte Veränderungen eines Fotos mittels z.B. Photoshop, Einfügen von Personen/Objekten vor einem neuen Hintergrund, etc.</p> 
  <p>Bei manchen der Bilder kann die Entscheidung leichtfallen, bei manchen ist die Entscheidung schwieriger. 
   Denken Sie nicht zu lange über Ihre Antwort nach, geben Sie im Zweifel ein intuitives Urteil ab.
  </p>
  <p> <b>Neu in dieser Sitzung</b> ist, dass Sie Unterstützung bei Ihren Entscheidungen erhalten. Sie erhalten 
  <b>Unterstützung in Form von KI-gestützten Bildklassifikationen</b>. 
  Genauere Informationen zur KI erhalten Sie auf der nächsten Seite. <br>
  Außerdem erhalten Sie in dieser Sitzung keine Rückmeldung per Ton, ob Sie richtig oder falsch geantwortet haben.
  </p>
  `

  const procedureEndscreen = `
  <p>Sie haben das Experiment abgeschlossen. Klicken Sie auf 'Weiter', um Ihre Daten abzuschicken und zu Prolific zurückzukehren.</p>
  `
  
  // introduction
  timeline.push(
    {
      type: HtmlButtonResponsePlugin,
      stimulus: procedure,
      choices: ["Weiter"]
    }
  )

  // KI-Info Grp A or B
  timeline.push({
    type: SurveyTextPlugin,
    questions: [
      {
        prompt: () => {
          if (condition === 1) {
            return kiInfoCond1_new
            } else {
              return kiInfoCond2_new
            }
        },
        rows: 10,
        columns: 140,
        required: true
      }
    ],
    
    button_label: 'Weiter'
  })


  // 2 blocks with very good prcntCorrect
  var prcntCorrect = 0.9;
  for (let subBlock = 0; subBlock < 2; subBlock++) {
    for (let trial = 0; trial < nTestTrials; trial++) {
      timeline.push({
        type: ClassificationComponent_rof,
        image: imagesTest_shuffled[subBlock*nTestTrials + trial][0],
        play_feedback:false,
        category_prompt: () => {
          let prompt;
          if(jsPsych.randomization.sampleBernoulli(prcntCorrect)) { 
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[subBlock*nTestTrials + trial][1]==0?"<b>Echt</b>":"<b>Fake</b>")+`</br> </br> </br>Ist das Bild echt oder fake?`
                    
          } else {
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[subBlock*nTestTrials + trial][1]==1?"<b>Echt</b>":"<b>Fake</b>")+`</br> </br> </br>Ist das Bild echt oder fake?`    
          }
          return prompt;
        },
        category_Names:[
          {categoryName:"Echt", categoryRight: imagesTest_shuffled[subBlock*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Fake", categoryRight: imagesTest_shuffled[subBlock*nTestTrials + trial][1]==1?true:false}
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
        prompt: "Wie sehr misstrauen Sie den KI-Klassifikationen?",
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
        prompt: "Wie sehr vertrauen Sie den KI-Klassifikationen?",
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
        type: ClassificationComponent_rof,
        image: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][0], // two blocks + current blocks and trials
        play_feedback:false,
        category_prompt: () => {
          let prompt;
          if(jsPsych.randomization.sampleBernoulli(prcntCorrect - (0.15*subBlock))) { // likelihood AI-advice is correct
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==0?"<b>Echt</b>":"<b>Fake</b>")+`</br> </br> </br>Ist das Bild echt oder fake?`
          } else {
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==1?"<b>Echt</b>":"<b>Fake</b>")+`</br> </br> </br>Ist das Bild echt oder fake?`
          }
          return prompt;
        },
        category_Names:[
          {categoryName:"Echt", categoryRight: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Fake", categoryRight: imagesTest_shuffled[2*nTestTrials + subBlock*nTestTrials + trial][1]==1?true:false}
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
        type: ClassificationComponent_rof,
        image: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][0], // 6 blocks + current blocks and trials
        play_feedback:false,
        category_prompt: () => {
          let prompt;
          if(jsPsych.randomization.sampleBernoulli(prcntCorrect)) { 
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==0?"<b>Echt</b>":"<b>Fake</b>")+`</br> </br> </br>Ist das Bild echt oder fake?`
          } else {
            prompt = `<b>KI-Klassifikation: </b> `+(imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==1?"<b>Echt</b>":"<b>Fake</b>")+`</br> </br> </br>Ist das Bild echt oder fake?`
          }
          return prompt;
        },
        category_Names:[
          {categoryName:"Echt", categoryRight: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==0?true:false},
          {categoryName:"Fake", categoryRight: imagesTest_shuffled[6*nTestTrials + subBlock*nTestTrials + trial][1]==1?true:false}
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
      prompt:"Für die Bilder auf denen Gesichter gezeigt waren: Wie sind bei Ihrer Entscheidung vorgegangen bzw. woran habe Sie erkannt, ob Bilder echt oder fake sind?", 
      rows: 10,
      columns: 140,
      },
      {
        prompt:"Für die Bilder auf denen Objekte gezeigt waren: Wie sind bei Ihrer Entscheidung vorgegangen bzw. woran habe Sie erkannt, ob Bilder echt oder fake sind?", 
        rows: 10,
        columns: 140,
      },
      {
        prompt:"Ist Ihnen etwas bezüglich der KI-Klassifikationen aufgefallen?", 
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
