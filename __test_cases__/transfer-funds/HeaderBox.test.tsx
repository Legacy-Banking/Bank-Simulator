import { render, screen } from '@testing-library/react';
import HeaderBox from '@/components/HeaderBox';
import '@testing-library/jest-dom';

describe('Transfer Funds Heading', () => { 
    
    it('display a title for the page', () => {

        const title = "Transfer Funds Page";
        const subtext = "Subtext for Transfer Funds page";
        const user = "Username";

        render(<HeaderBox title={title} subtext={subtext} user={user}/>)

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/Transfer Funds/i);
        expect(heading).not.toHaveTextContent(user);

    });

    it('display a subtext for title for the page', () => {

        const title = "Transfer Funds Page";
        const subtext = "Subtext for Transfer Funds page";

        render(<HeaderBox title={title} subtext={subtext}/>)

        expect(screen.getByText(subtext)).toBeInTheDocument();

    });

 })