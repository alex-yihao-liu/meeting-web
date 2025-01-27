import { Box } from "@mui/material";
import { ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
}


const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            {children}
        </Box>
    );
};



export default PageContainer;