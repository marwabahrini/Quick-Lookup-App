import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import Button from './components/Button';



interface DataItem {
    MBOLevel?: string;
    Participant: string;
    Enthusiasm?: number;
    Reliability?: number;
    Total?: string | null;
}

const App: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [competency, setCompetency] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<'Participant' | 'Summary Method'>('Participant');
    const [participant, setParticipant] = useState<string | null>(null);
    const [summaryMethod, setSummaryMethod] = useState<string | null>(null);
    const [output, setOutput] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/scores.json');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleButtonClick = () => {
        if (!competency || ((selectedOption === 'Participant' && !participant) || (selectedOption === 'Summary Method' && !summaryMethod))) {
            return;
        }

        let result = '';

        if (selectedOption === 'Participant' && participant) {
            result = handleParticipantSelection();
        } else if (selectedOption === 'Summary Method' && summaryMethod) {
            result = handleSummaryMethodSelection();
        }

        setOutput(result);
    };

    const handleParticipantSelection = (): string => {
        const participantData = data.find(item => item.Participant === participant);
        if (participantData) {
            if (competency === 'Total') {
                return participantData.Total ? `${participant} scored ${participantData.Total} on Total` : `${participant} has no score for Total`;
            } else {
                return `${participant} scored ${participantData[competency as keyof DataItem] || 0} on ${competency}`;
            }
        }
        return '';
    };

    const handleSummaryMethodSelection = (): string => {
        let summary: string | number = '';

        switch (summaryMethod) {
            case 'lowest':
                summary = getLowest();
                break;
            case 'highest':
                summary = getHighest();
                break;
            case 'average':
                summary = getAverage();
                break;
            case 'type':
                summary = data.every(item => typeof item[competency as keyof DataItem] === 'number') ? 'score' : 'level';
                break;
            default:
                break;
        }

        return `The ${summaryMethod} score for ${competency} is ${summary}`;
    };

    const getLowest= (): string | number => {
        if (competency === 'Total') {
            const minTotal = Math.min(...data.map(item => parseFloat(item.Total || '0')).filter(value => !isNaN(value)));
            return isFinite(minTotal) ? Math.ceil(minTotal * 10) / 10 : '';
        } else if (competency === 'MBOLevel') {
            const levels = data.map(item => item.MBOLevel).filter(level => level !== undefined);
            return levels.length > 0 ? levels.sort((a, b) => b!.localeCompare(a!))[0] || '' : '';
        } else {
            const min = Math.min(...(data.map(item => item[competency as keyof DataItem] as number).filter(value => !isNaN(value))));
            return isFinite(min) ? Math.ceil(min * 10) / 10 : '';
        }
    };

    const getHighest = (): string | number => {
        if (competency === 'Total') {
            const maxTotal = Math.max(...data.map(item => parseFloat(item.Total || '0')).filter(value => !isNaN(value)));
            return isFinite(maxTotal) ? Math.ceil(maxTotal * 10) / 10 : '';
        } else if (competency === 'MBOLevel') {
            const levels = data.map(item => item.MBOLevel).filter(level => level !== undefined);
            return levels.length > 0 ? levels.sort((a, b) => a!.localeCompare(b!))[0] || '' : '';
        } else {
            const max = Math.max(...(data.map(item => item[competency as keyof DataItem] as number).filter(value => !isNaN(value))));
            return isFinite(max) ? Math.ceil(max * 10) / 10 : '';
        }
    };

    const getAverage = (): string | number => {
        if (competency === 'Total') {
            const totalValues = data.map(item => parseFloat(item.Total || '0')).filter(value => !isNaN(value));
            const sumTotal = totalValues.reduce((acc, val) => acc + val, 0);
            return  totalValues.length > 0 ? Math.ceil((sumTotal / totalValues.length) * 10) / 10 : '';
        } else if (competency === 'MBOLevel') {
            const levels = data.map(item => item.MBOLevel).filter(level => level !== undefined);
            const averageASCII = levels.reduce((acc, level) => acc + level!.charCodeAt(0), 0) / levels.length;
            return String.fromCharCode(Math.round(averageASCII));
        } else {
            const competencyValues = data.map(item => item[competency as keyof DataItem] as number);
            const sum = competencyValues.reduce((acc, val) => acc + val, 0);
            return competencyValues.length > 0 ? Math.ceil((sum / competencyValues.length) * 10) / 10 : '';
        }
    };

    const handleOptionChange = (option: 'Participant' | 'Summary Method') => {
        setSelectedOption(option);
        // Reset output when changing options
        setOutput('');
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">Quick Lookup App</h2>
            <div className="flex items-center mb-4">
                <input type="radio" id="participant" name="option" checked={selectedOption === 'Participant'}
                       onChange={() => handleOptionChange('Participant')}/>
                <label htmlFor="participant" className="ml-2">Participant</label>
                <input type="radio" id="summaryMethod" name="option" checked={selectedOption === 'Summary Method'}
                       onChange={() => handleOptionChange('Summary Method')} className="ml-4"/>
                <label htmlFor="summaryMethod" className="ml-2">Summary Method</label>
            </div>
            <Dropdown
                label={selectedOption === 'Participant' ? "Participant" : "Summary Method"}
                options={selectedOption === 'Participant' ? data.map((item, index) => ({
                    label: `Participant ${index + 1}`,
                    value: item.Participant
                })) : ['lowest', 'highest', 'average', 'type'].map(option => ({label: option, value: option}))}
                onSelect={selectedOption === 'Participant' ? setParticipant : setSummaryMethod}
            />
            <Dropdown
                label="Competency"
                options={['Enthusiasm', 'Reliability', 'MBOLevel', 'Total'].map(option => ({
                    label: option,
                    value: option
                }))}
                onSelect={setCompetency}
            />
            <Button onClick={handleButtonClick}
                    disabled={!competency || ((selectedOption === 'Participant' && !participant) || (selectedOption === 'Summary Method' && !summaryMethod))}
                    className="my-4"/>
            <div className="mt-4">{output}</div>
        </div>
    );
};

export default App;
