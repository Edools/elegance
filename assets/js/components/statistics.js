(function () {
    'use strict';

    app.randomQuizStatistics = function () {
        var $statistic = $(".statistic");
        var statisticArray = [];
        var finalArray = [];

        var getData = function(property) {
            return $statistic[i].attributes[property].value;
        }

        for (var i = 0; i < $statistic.size(); i++) {
            
            var tag = getData('data-tag');
            var difficulty = getData('data-difficulty');
            var quantity = getData('data-quantity');
            var hits = getData('data-hits');

            statisticArray.push({
                'id' : `${tag}-${difficulty}`,
                'quantity' : quantity,
                'hits' : hits,
                'tag' : tag,
                'difficulty': difficulty
            });

        }

        var groupedTags = _.uniqBy(statisticArray, 'id');

        for (var i = 0; i < groupedTags.length; i++) {

            var currentID = groupedTags[i].id;
            var matchedTags = _.filter(statisticArray, _.matches({ 'id': currentID }));
            
            var totalQuantity = 0,
            totalHits = 0,
            finalTag = '',
            finalDifficulty = ''; 

            _.forEach(matchedTags, function(value) {
                totalQuantity += parseInt(value.quantity);
                totalHits += parseInt(value.hits);
                finalTag = value.tag;
                finalDifficulty = value.difficulty;
            });

            var totalErrors = totalQuantity - totalHits;
            var performance = (totalHits / totalQuantity * 100).toFixed() + '%';

            finalArray.push({
                'tag' : finalTag,
                'difficulty' : finalDifficulty,
                'total' : totalQuantity,
                'correct_anwsers' : totalHits,
                'wrong_answers' : totalErrors,
                'performance' : performance 
            });
        }
            
        var vocabulary = $('.statistic-texts').first().data();
        var $div = $('#course-statistics');

        _.forEach(finalArray, function(value) {
            var template = 
            `<div class="row statistic-item">    
                <div class="statistics-board">        
                    <div class="row statistic-label">
                        <h2 class="tag">${value.tag}</h2>
                        <h2 class="difficulty">${value.difficulty}</h2>
                    </div>
                    <div class="col-md-3 box-outline">
                        <div class="statistic-box total">
                            <p class="result">${value.total}</p>
                            <p class="name">${vocabulary.textAnswered}</p>
                            <div class="box-footer">        
                            </div>
                        </div>
                    </div> 
                    <div class="col-md-3 box-outline">
                        <div class=" statistic-box correct">
                            <p class="result">${value.correct_anwsers}</p>
                            <p class="name">${vocabulary.textRight}</p>
                            <div class="box-footer">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 box-outline">
                        <div class="statistic-box wrong">
                            <p class="result">${value.wrong_answers}</p>
                            <p class="name">${vocabulary.textWrong}</p>
                            <div class="box-footer">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 box-outline">
                        <div class="statistic-box performance">
                            <p class="result">${value.performance}</p>
                            <p class="name">${vocabulary.textPerformance}</p>
                            <div class="box-footer">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    
            $div.append(template);
        });

         $(document).trigger('app:bind:randomQuizStatistics');
    };
})();
