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
                        'text' => '%text%'
                    ]
                ],
                'h3' => [
                    'heading' => [
                        'heading' => '%text%',
                        'headingType' => 'h3'
                    ]
                ],
                'p' => [
                    'richText' => [
                        'richText' => '%text%'
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
