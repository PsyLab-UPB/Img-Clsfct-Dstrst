import { JsPsych } from 'jspsych';

import { ParameterType } from 'jspsych';

import { playAudio } from "../util/audio";
import HtmlButtonResponsePlugin from '@jspsych/plugin-html-button-response';
/**
 * **Html Button Response With Feedback Plugin**
 *
 * 
 *
 * @author Kai Biermeier
 */
class HtmlButtonResponseWithFeedbackPlugin extends HtmlButtonResponsePlugin{
    static info = {
        ...HtmlButtonResponsePlugin.info,
        play_feedback:{
            type: ParameterType.BOOL,
            pretty_name: "Play Feedback",
            default: false,
        },
        answerCorrect:{
            type: ParameterType.INT,
            pretty_name: "answerCorrect",
            default: 0,
        },
    };
    private _jsPsych: JsPsych
    constructor(jsPsych: JsPsych) { 
        super(jsPsych)
        this._jsPsych = jsPsych;
    }
    trial(display_element, trial) {
        super.trial(display_element, trial)
        if(trial.play_feedback){
            for (var i = 0; i < trial.choices.length; i++) {
                if(i == trial.answerCorrect){
                    display_element
                    .querySelector("#jspsych-html-button-response-button-" + i)
                    .addEventListener("click", (e) => {
                        if (trial.play_feedback) {
                            playAudio(`assets/audio/feedback/right.wav`);
                        }
                    });
                }
                else{
                    display_element
                    .querySelector("#jspsych-html-button-response-button-" + i)
                    .addEventListener("click", (e) => {
                        playAudio(`assets/audio/feedback/wrong.wav`);
                    });
                }  
            }
        }
        this._jsPsych.data.addDataToLastTrial({"imagesA":trial.A_images})
        //this._jsPsych.data.addProperties({"imagesB":trial.B_images})
        this._jsPsych.data.addDataToLastTrial({"imagesB":trial.B_images})
        this._jsPsych.data.addDataToLastTrial({"imageTest":trial.Test_image})
        
        //console.log(this._jsPsych.data.getLastTrialData())
    }
}

export { HtmlButtonResponseWithFeedbackPlugin as default };