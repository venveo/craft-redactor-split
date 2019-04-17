<?php

namespace venveo\redactorsplit\services;

use craft\base\Component;

class RedactorSplit extends Component {

    public function getMappings(): array
    {
        return [
            'contentBuilder' => [
                'h2' => [
                    'heading' => [
                        'heading' => '%text%',
                        'headingType' => 'h2'
                    ]
                ],
                'h3' => [
                    'heading' => [
                        'heading' => '%text%',
                        'headingType' => 'h3'
                    ]
                ],
                'p' => [
                    'text' => [
                        'text' => '%text%'
                    ]
                ],
                'pre' => [
                    'code' => [
                        'code' => '%text%'
                    ]
                ],
            ]
        ];
    }
}
